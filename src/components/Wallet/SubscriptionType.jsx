import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { resolvePath } from 'react-router-dom';

const SubscriptionType = ({ subscriptionId }) => {
  const [serviceType, setServiceType] = useState('');

  useEffect(() => {
    const fetchServiceType = async () => {
      try {
        const response = await axios.get(`https://copartners.in:5009/api/Subscription/${subscriptionId}`);
        response ? setServiceType(response.data.data.serviceType) : setServiceType('')
      } catch (error) {
        console.error("Error fetching subscription data:", error);
      }
    };

    fetchServiceType();
  }, []);

  return serviceType;
};

export default SubscriptionType;
