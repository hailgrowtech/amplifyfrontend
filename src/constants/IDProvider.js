import React, { createContext, useContext, useState } from "react";

const IdContext = createContext();

export const IDProvider = ({children}) => {
  const [ids, setIds] = useState("5ecd1be4-0f03-450e-cc72-08dc76f5cdab");

  return (
    <IDProvider.Provider value={{ids, setIds}}>
        {children}
    </IDProvider.Provider>
  );
};

export const useId = () => useContext(IdContext);

