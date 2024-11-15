import React, { createContext, useState, useEffect, useContext } from "react";

export const UserContext = createContext();

export const useUserSession = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(
            `https://copartners.in:5131/api/User/${userId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          const data = await response.json();

          if (data.data && data.data.mobileNumber) {
            setUserData(data.data);
          } else {
            const storedMobileNumber = localStorage.getItem("mobileNumber");
            const userId = localStorage.getItem("userId");
            setUserData((prevData) => ({
              ...prevData,
              mobileNumber: storedMobileNumber || "",
              id: userId || ""
            }));
          }
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ userData, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
