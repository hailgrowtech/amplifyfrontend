
import React from 'react';

function UserDisplay({ users, totalUsers }) {
  return (
    <div className="flex items-center space-x-1">
      {users.slice(0, 5).map((user) => (
        <img
          key={user.userID}
          src={user.profilePic || 'https://via.placeholder.com/40'} // Placeholder if no profilePic
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-white"
          title={user.name}
        />
      ))}
      {totalUsers > 5 && (
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm border-2 border-white">
          +{totalUsers - 5}
        </div>
      )}
      <span className="text-white text-sm">{totalUsers} {totalUsers === 1 ? 'viewer' : 'viewers'}</span>
    </div>
  );
}

export default UserDisplay;