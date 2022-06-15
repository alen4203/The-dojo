import { useEffect, useState } from "react";
import { projectFirestore } from "../firebase/config.js";

export const useDocument = function (collection, id) {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ref = projectFirestore.collection(collection).doc(id);
    const unsub = ref.onSnapshot(
      (snapshot) => {
        if (!snapshot.exists) {
          setError("Document does not exist...");
          return;
        }
        setDocument({ ...snapshot.data(), id: snapshot.id });
        setError(null);
      },
      (err) => {
        console.log(err.message);
        setError("Failed to get document...");
      }
    );
    return () => unsub();
  }, [collection, id]);

  return { document, error };
};
