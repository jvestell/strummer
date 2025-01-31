import React from 'react';
import { Music } from 'lucide-react';

export const Counter = ({ count = 0 }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Music className="w-6 h-6 text-blue-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-700">Strum Count</h2>
        </div>
        <div 
          className="text-3xl font-bold text-blue-600 tabular-nums"
          key={count} // Forces re-render for animation
        >
          <div className="animate-count">
            {count}
          </div>
        </div>
      </div>

      {/* Optional: Add a visual indicator for recent counts */}
      {count > 0 && (
        <div className="mt-2 flex justify-end">
          <div className="text-sm text-gray-500">
            Last strum detected{' '}
            <span className="animate-pulse inline-block w-2 h-2 bg-blue-500 rounded-full ml-1" />
          </div>
        </div>
      )}
    </div>
  );
};

// Add display name for dev tools
Counter.displayName = 'Counter';