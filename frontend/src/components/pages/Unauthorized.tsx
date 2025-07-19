import React from 'react';

const Unauthorized: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized</h1>
      <p className="text-lg">You do not have permission to view this page.</p>
    </div>
  </div>
);

export default Unauthorized; 