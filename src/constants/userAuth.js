import React, { createContext, useState, useContext } from 'react';

const UserAuth = createContext();

export const useUser = () => {
  return useContext(UserAuth);
};

export const UserAuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  const setUserAuth = (user) => {
    setUserId(user);
  };

  return (
    <UserAuth.Provider value={{ userId, setUserAuth }}>
      {children}
    </UserAuth.Provider>
  );
};
