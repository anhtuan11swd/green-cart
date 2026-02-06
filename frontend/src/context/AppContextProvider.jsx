import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./AppContext";

const formatVND = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    currency: "VND",
    style: "currency",
  }).format(price);
};

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const value = {
    formatVND,
    isSeller,
    navigate,
    searchTerm,
    setIsSeller,
    setSearchTerm,
    setUser,
    user,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
