import { projectFirestore } from "../firebase/config";
import { useState, useEffect, useRef } from "react";

export const useMessages = function (myId, chatWithId) {
  const [error, setError] = useState(null);
  const [documentsSend, setDocumentsSend] = useState([]);
  const [documentsReceive, setDocumentsReceive] = useState([]);
  const [documentsAll, setDocumentsAll] = useState([]);

  useEffect(() => {
    setError(null);

    const unsub1 = projectFirestore
      .collection("messages")
      .where("from", "==", myId)
      .where("to", "==", chatWithId)
      .onSnapshot(
        (snapshot) => {
          let results = [];
          snapshot.forEach((doc) => {
            results.push({ ...doc.data(), id: doc.id });
          });
          setDocumentsSend(results);
        },
        (error) => {
          setError(error.message);
        }
      );

    const unsub2 = projectFirestore
      .collection("messages")
      .where("from", "==", chatWithId)
      .where("to", "==", myId)
      .onSnapshot(
        (snapshot) => {
          let results = [];
          snapshot.forEach((doc) => {
            results.push({ ...doc.data(), id: doc.id });
          });
          setDocumentsReceive(results);
        },
        (error) => {
          setError(error.message);
        }
      );

    return () => {
      unsub1();
      unsub2();
    };
  }, [myId, chatWithId]);

  useEffect(() => {
    setDocumentsAll(
      [...documentsSend, ...documentsReceive].sort(
        (a, b) => a.createdAt.toMillis() - b.createdAt.toMillis()
      )
    );
  }, [documentsSend, documentsReceive]);

  return { error, documentsAll };
};
