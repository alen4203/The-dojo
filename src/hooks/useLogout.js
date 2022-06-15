import { useState } from "react";
import { projectAuth, projectFirestore } from "../firebase/config.js";
import { useAuthContext } from "./useAuthContext.js";

export const useLogout = function () {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch, user } = useAuthContext();

  const logout = async function () {
    try {
      setError(null);
      setIsPending(true);

      // Set firestore user document's online status to false
      await projectFirestore
        .collection("users")
        .doc(user.uid)
        .update({ online: false });

      await projectAuth.signOut();
      // sign the user out

      dispatch({ type: "LOGOUT" });

      setError(null);
      setIsPending(false);
    } catch (err) {
      console.log(err.message);
      setError(err.message);
      setIsPending(false);
    }
  };

  return { error, isPending, logout };
};
