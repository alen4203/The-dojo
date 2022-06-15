import { createContext, useReducer, useEffect } from "react";
import { projectAuth } from "../firebase/config.js";

export const AuthContext = createContext();

const authReducer = function (state, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "AUTH_READY":
      return { ...state, user: action.payload, authReady: true };
    default:
      return state;
  }
};

export const AuthContextProvider = function ({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authReady: false,
  });

  useEffect(() => {
    const unsub = projectAuth.onAuthStateChanged((user) => {
      dispatch({ type: "AUTH_READY", payload: user });
    });
    return () => unsub();
  }, []);

  console.log(`AuthContext state: `, state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
