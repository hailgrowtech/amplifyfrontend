
import React from 'react';

const SuccessPage = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-green-100">
      <div className="bg-white border border-green-300 rounded p-6 shadow-md">
        <h2 className="text-2xl font-bold text-green-800">Payment Completed</h2>
        <p className="mt-4 text-green-700">Thank you for your payment. Your transaction was successful.</p>
      </div>
    </div>
  );
};

export default SuccessPage;