import { useEffect, useRef, useState } from "react";
import { projectFirestore } from "../firebase/config.js";

export const useCollection = function (collection, _query, _orderBy) {
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState([]);

  const query = useRef(_query).current;
  const orderBy = useRef(_orderBy).current;

  useEffect(() => {
    let ref = projectFirestore.collection(collection);
    if (query) ref = ref.where(...query);
    if (orderBy) ref = ref.orderBy(...orderBy);

    const unsub = ref.onSnapshot(
      (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });

        setDocuments(results);
        setError(null);
      },
      (err) => {
        console.log(err);
        setError("Could not fetch data");
      }
    );
    return () => unsub();
  }, [collection, query, orderBy]);

  return { error, documents };
};
