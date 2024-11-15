// SubscriptionContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const SubscriptionContext = createContext();

export const useSubscriptionSession = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }) => {
  const [transactionTable, setTransactionTable] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      const fetchTransactionData = async () => {
        try {
          const res = await axios.get(
            `https://copartners.in:5009/api/Subscriber/GetByUserId/${userId}`
          );
          setTransactionTable(res.data.data);
        } catch (error) {
          setTransactionTable([]);
        }
      };

      fetchTransactionData();
    }
  }, [userId]);

  return (
    <SubscriptionContext.Provider value={{ transactionTable }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
