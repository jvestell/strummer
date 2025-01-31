import React, { useEffect } from 'react';
import { Camera as CameraIcon } from 'lucide-react';
import { useCamera } from '../../hooks/useCamera';
import { useMotionDetection } from '../../hooks/useMotionDetection';

export const Camera = ({ isActive, onStrumDetected }) => {
  const { videoRef, isReady, captureFrame } = useCamera();
  const { detectMotion, resetDetection } = useMotionDetection({
    onMotionDetected: onStrumDetected,
    sensitivity: 30,
    cooldownPeriod: 500
  });

  useEffect(() => {
    let stream = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 320 },
            height: { ideal: 240 },
            facingMode: 'user'
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    startCamera();

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoRef]);

  // Add motion detection loop
  useEffect(() => {
    let animationFrameId;

    const processFrame = () => {
      if (isActive && isReady) {
        const frame = captureFrame();
        if (frame) {
          detectMotion(frame);
        }
      }
      animationFrameId = requestAnimationFrame(processFrame);
    };

    if (isActive) {
      processFrame();
    } else {
      resetDetection();
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isActive, isReady, captureFrame, detectMotion, resetDetection]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center mb-3">
        <CameraIcon className="w-6 h-6 text-blue-500 mr-2" />
        <h2 className="text-lg font-semibold text-gray-700">Camera Feed</h2>
      </div>

      <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        
        {!isActive && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
            <p className="text-white text-sm font-medium">Press Start to begin</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Add display name for dev tools
Camera.displayName = 'Camera';
