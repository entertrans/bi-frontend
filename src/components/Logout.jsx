import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Logout = () => {
  const { logout } = useAuth();

  React.useEffect(() => {
    logout();
  }, [logout]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Sedang logout...</p>
      </div>
    </div>
  );
};

export default Logout;