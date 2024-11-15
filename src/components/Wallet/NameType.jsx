import React, { useState, useEffect } from "react";
import axios from "axios";

const NameType = ({ subscriptionId }) => {
  const [experts, setExperts] = useState("");

  useEffect(() => {
    const fetchServiceType = async () => {
      try {
        const response = await axios.get(`https://copartners.in:5009/api/Subscription/${subscriptionId}`);
        response ? setExperts(response.data.data.experts) : setExperts('')
      } catch (error) {
        console.error("Error fetching subscription data:", error);
      }
    };

    fetchServiceType();
  }, []);

  return experts;
};

export default NameType;
