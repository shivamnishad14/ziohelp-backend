import React from 'react';

interface ProgressProps {
  value: number; // 0-100
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, className }) => {
  return (
    <div className={`w-full bg-gray-200 rounded h-2 ${className || ''}`.trim()}>
      <div
        className="bg-blue-500 h-2 rounded"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}; 