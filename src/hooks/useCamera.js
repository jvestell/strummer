import { useState, useEffect, useRef } from 'react';
import { useMotionDetection } from './useMotionDetection';

export const useCamera = ({ isActive, onStrumDetected }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const { startDetection, stopDetection } = useMotionDetection({
    videoRef,
    canvasRef,
    onMotionDetected: onStrumDetected,
    sensitivity: 35,
    cooldownPeriod: 150
  });

  // Clean up function to stop all tracks
  const stopVideoStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Initialize camera when component mounts or isActive changes
  useEffect(() => {
    const startCamera = async () => {
      // Clean up any existing stream first
      stopVideoStream();

      if (!isActive) {
        setHasPermission(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 320 },
            height: { ideal: 240 }
          },
          audio: false
        });

        if (videoRef.current && isActive) {
          streamRef.current = stream;
          videoRef.current.srcObject = stream;
          setHasPermission(true);
          setError(null);
        } else {
          // If component was deactivated during getUserMedia call
          stream.getTracks().forEach(track => track.stop());
        }
      } catch (err) {
        setError('Camera permission denied');
        setHasPermission(false);
      }
    };

    startCamera();

    // Cleanup function
    return () => {
      stopVideoStream();
    };
  }, [isActive]); // Now depends on isActive

  useEffect(() => {
    if (hasPermission && isActive) {
      startDetection();
    } else {
      stopDetection();
    }
  }, [hasPermission, isActive, startDetection, stopDetection]);

  return {
    videoRef,
    canvasRef,
    hasPermission,
    error
  };
};
