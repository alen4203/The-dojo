import { useState } from "react";
import { projectAuth, projectFirestore } from "../firebase/config.js";
import { useAuthContext } from "./useAuthContext.js";

export const useLogin = function () {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async function (email, password) {
    try {
      setError(null);
      setIsPending(true);

      // sign user in
      const res = await projectAuth.signInWithEmailAndPassword(email, password);

      // update online status
      await projectFirestore
        .collection("users")
        .doc(res.user.uid)
        .update({ online: true });

      dispatch({ type: "LOGIN", payload: res.user });

      setError(null);
      setIsPending(false);
    } catch (err) {
      console.log(err.message);
      setError(err.message);
      setIsPending(false);
    }
  };

  return { error, isPending, login };
};
