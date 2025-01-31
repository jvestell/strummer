import React from 'react';

export const Counter = ({ count = 0 }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div 
        className="relative"
        key={count}
      >
        {/* Background circle */}
        <div className="absolute inset-0 bg-blue-50 rounded-full transform scale-110" />
        
        {/* Counter number */}
        <div className="relative z-10 text-8xl font-bold text-blue-600 tabular-nums p-12">
          <div className="animate-count">
            {count}
          </div>
        </div>
        
        {/* Pulse animation for active counting */}
        {count > 0 && (
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75" />
        )}
      </div>
      
      <div className="text-sm font-medium text-gray-600 mt-4 tracking-wide uppercase">
        Strums
      </div>
    </div>
  );
};

// Add display name for dev tools
Counter.displayName = 'Counter';