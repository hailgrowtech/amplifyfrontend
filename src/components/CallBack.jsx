import React from 'react';
import { useLocation } from 'react-router-dom';

const CallBack = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const status = query.get('status');

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-yellow-100">
      <div className="bg-white border border-yellow-300 rounded p-6 shadow-md">
        <h2 className="text-2xl font-bold text-yellow-800">Payment Status</h2>
        <p className="mt-4 text-yellow-700">
          {status === 'SUCCESS' ? 'Payment was successful.' : 'Payment failed. Please try again.'}
        </p>
      </div>
    </div>
  );
};

export default CallBack;