import React, { useRef, useEffect } from 'react';
import { Camera as CameraIcon } from 'lucide-react';
import { useCamera } from '../../hooks/useCamera';
import { useMotionDetection } from '../../hooks/useMotionDetection';

export const Camera = ({ isActive, onStrumDetected }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const { 
    hasPermission,
    requestPermission,
    startCamera,
    stopCamera,
    error 
  } = useCamera(videoRef);
  
  const { startDetection, stopDetection } = useMotionDetection({
    videoRef,
    canvasRef,
    onMotionDetected: onStrumDetected,
    sensitivity: 30, // Adjust this value based on testing
    cooldownPeriod: 150 // Minimum ms between detections
  });

  useEffect(() => {
    if (isActive && hasPermission) {
      startCamera();
      startDetection();
    } else {
      stopDetection();
      stopCamera();
    }
    
    return () => {
      stopDetection();
      stopCamera();
    };
  }, [isActive, hasPermission, startCamera, startDetection, stopCamera, stopDetection]);

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600 text-center">
          Camera error: {error}
        </p>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-center mb-4">Camera permission is needed to detect strums</p>
        <button
          onClick={requestPermission}
          className="mx-auto flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <CameraIcon className="w-5 h-5 mr-2" />
          Enable Camera
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-32 h-24 bg-gray-900 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        playsInline
        muted
        autoPlay
        webkit-playsinline="true"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full opacity-0"
      />
      {isActive && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </div>
      )}
    </div>
  );
};