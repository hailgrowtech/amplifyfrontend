import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SubscriptionExistsPopup = () => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(5); // Initialize timer with 5 seconds

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1); // Decrement the timer by 1 every second
    }, 1000);

    const timeout = setTimeout(() => {
      navigate("/"); // Redirect to homepage after 5 seconds
    }, 5000);

    // Cleanup the intervals if the component unmounts before the timeout completes
    return () => {
      clearInterval(countdown);
      clearTimeout(timeout);
    };
  }, [navigate]);

  const handleConfirm = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[300px] text-center">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Subscription Exists</h2>
        <p className="text-gray-700 mb-4">
          You have already purchased this subscription.
        </p>
        <button
          onClick={handleConfirm}
          className="w-full py-2 bg-blue-500 text-base text-white rounded-md hover:bg-blue-700"
        >
          Go to Homepage
        </button>
        <p className="text-sm text-gray-500 mt-4">
          Redirecting in {timer} seconds...
        </p>
      </div>
    </div>
  );
};

export default SubscriptionExistsPopup;
