// authContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import jwt_decode from 'jwt-decode';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const token = sessionStorage.getItem('authToken');
  const stackholderId = sessionStorage.getItem('stackholderId');
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true'; // Convert to boolean

  const [authState, setAuthState] = useState({
    token,
    stackholderId,
    isAuthenticated,
  });

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const expirationTime = sessionStorage.getItem('tokenExpiration');

    if (token && expirationTime) {
      const isTokenExpired = Date.now() > Number(expirationTime);
      if (isTokenExpired) {
        logout();
      } else {
        setAuthState({
          token,
          stackholderId: sessionStorage.getItem('stackholderId'),
          isAuthenticated: true,
        });
        sessionStorage.setItem('isAuthenticated', 'true'); // Ensure it's stored as a string
      }
    }
  }, []);

  const logout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('stackholderId');
    sessionStorage.removeItem('tokenExpiration');
    sessionStorage.removeItem('isAuthenticated');
    setAuthState({ token: null, stackholderId: null, isAuthenticated: false });
    window.location.href = '/signup';
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
