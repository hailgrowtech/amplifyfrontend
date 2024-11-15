import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Notification Component
 *
 * Props:
 * - id: Unique identifier for the notification.
 * - type: Type of notification ('success', 'error', 'info', 'warning').
 * - message: Notification message to display.
 * - onClose: Function to call when the notification should be removed.
 * - duration: Duration in milliseconds before the notification auto-dismisses.
 */
function Notification({ id, type, message, onClose, duration = 5000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [id, onClose, duration]);

  // Define styles based on notification type
  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-4 mb-2 rounded shadow-lg text-white ${getBackgroundColor()} transition-transform transform hover:scale-105`}
    >
      <span>{message}</span>
      <button
        onClick={() => onClose(id)}
        className="ml-4 text-lg font-bold focus:outline-none"
        aria-label="Close Notification"
      >
        &times;
      </button>
    </div>
  );
}

Notification.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'info', 'warning']).isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number,
};

export default Notification;