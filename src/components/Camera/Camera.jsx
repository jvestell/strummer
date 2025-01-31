import React from 'react';
import { Camera as CameraIcon } from 'lucide-react';
import { useCamera } from '../../hooks/useCamera';

export const Camera = ({ isActive, onStrumDetected }) => {
  const { videoRef, canvasRef, hasPermission, error } = useCamera({
    isActive,
    onStrumDetected
  });

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center text-red-800">
          <CameraIcon className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
      <div className="aspect-w-4 aspect-h-3 max-h-[180px]">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`object-cover w-full h-full transform ${
            hasPermission ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        {/* Hidden canvas for motion detection */}
        <canvas
          ref={canvasRef}
          className="hidden"
        />
      </div>

      {!hasPermission && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-white flex items-center">
            <CameraIcon className="w-5 h-5 mr-2 animate-pulse" />
            <span>Requesting camera access...</span>
          </div>
        </div>
      )}

      {/* Optional: Activity indicator when detection is active */}
      {isActive && hasPermission && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
};

// Add display name for dev tools
Camera.displayName = 'Camera';
