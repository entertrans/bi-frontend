import React from "react";

const EmptyState = ({ icon, title, message }) => (
  <div className="text-center py-6">
    <div className="text-3xl mb-2">{icon}</div>
    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-400 text-xs">
      {message}
    </p>
  </div>
);

export default EmptyState;