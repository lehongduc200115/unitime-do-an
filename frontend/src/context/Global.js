import React, { createContext, useContext, useState } from "react";

export const GlobalContext = createContext(null);

export const Global = ({ children }) => {
  const [user, setUser] = useState({
    name: "ducle",
  });
  return (
    <GlobalContext.Provider
      value={{
        PROJECT_NAME: "project name",
        user,
        setUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
