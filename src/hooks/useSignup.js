import { useState } from "react";
import {
  projectAuth,
  projectStorage,
  projectFirestore,
} from "../firebase/config.js";
import { useAuthContext } from "./useAuthContext.js";

export const useSignup = function () {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async function (email, password, displayName, thumbnail) {
    try {
      setError(null);
      setIsPending(true);

      const res = await projectAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      if (!res) throw new Error("Cannot complete signup...");

      // upload user thumbnail
      const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`;
      const img = await projectStorage.ref(uploadPath).put(thumbnail);
      const imgUrl = await img.ref.getDownloadURL();

      // add displayName to user
      await res.user.updateProfile({ displayName, photoURL: imgUrl });

      // create a user document
      await projectFirestore.collection("users").doc(res.user.uid).set({
        online: true,
        displayName,
        photoURL: imgUrl,
      });

      dispatch({ type: "LOGIN", payload: res.user });

      setError(null);
      setIsPending(false);
    } catch (err) {
      console.log(err.message);
      setError(err.message);
      setIsPending(false);
    }
  };

  return { error, isPending, signup };
};
