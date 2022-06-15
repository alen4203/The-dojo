import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";

export const useAuthContext = function () {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error(
      "useAuthContext must be used inside an AuthContextProvider"
    );

  return context;
};
