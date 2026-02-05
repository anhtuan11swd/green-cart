import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./AppContext";

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);

  const value = {
    isSeller,
    navigate,
    setIsSeller,
    setUser,
    user,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
