import { useReducer } from "react";
import { projectFirestore, timestamp } from "../firebase/config.js";

const initialState = {
  error: null,
  isPending: false,
  document: null,
  success: null,
};

const firestoreReducer = function (state, action) {
  switch (action.type) {
    case "IS_PENDING":
      return { error: null, isPending: true, document: null, success: false };
    case "ADDED_DOCUMENT":
      return {
        error: null,
        isPending: false,
        document: action.payload,
        success: true,
      };
    case "DELETE_DOCUMENT":
      return { error: null, isPending: false, document: null, success: true };
    case "UPDATED_DOCUMENT":
      return {
        error: null,
        isPending: false,
        document: null,
        success: true,
      };
    case "ERROR":
      return {
        error: action.payload,
        isPending: false,
        document: null,
        success: false,
      };
    default:
      return state;
  }
};

export const useFirestore = function (collection) {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);

  const ref = projectFirestore.collection(collection);

  const addDocument = async function (doc) {
    try {
      dispatch({ type: "IS_PENDING" });

      const createdAt = timestamp.fromDate(new Date());
      const addedDocument = await ref.add({ ...doc, createdAt });

      dispatch({ type: "ADDED_DOCUMENT", payload: addedDocument });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  };

  const deleteDocument = async function (id) {
    try {
      dispatch({ type: "IS_PENDING" });

      await ref.doc(id).delete();

      dispatch({ type: "DELETE_DOCUMENT" });
    } catch (err) {
      dispatch({ type: "ERROR", payload: "Could not delete..." });
    }
  };

  const updateDocument = async function (id, updates) {
    try {
      dispatch({ type: "IS_PENDING" });

      await ref.doc(id).update(updates);

      dispatch({ type: "UPDATED_DOCUMENT" });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  };

  return { response, addDocument, deleteDocument, updateDocument };
};
