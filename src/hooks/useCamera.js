import { useState, useEffect, useRef } from 'react';
import { useMotionDetection } from './useMotionDetection';

export const useCamera = ({ onStrumDetected, isActive }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState(null);
  const motionDetection = useMotionDetection({
    videoRef,
    canvasRef,
    onMotionDetected: onStrumDetected,
  });

  // Initialize camera stream on mount
  useEffect(() => {
    let mounted = true;

    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' } 
        });
        
        if (mounted) {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setHasPermission(true);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError('Camera access denied. Please check your permissions.');
          setHasPermission(false);
        }
      }
    };

    initializeCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // Empty dependency array - only run on mount

  // Start/stop motion detection based on isActive prop
  useEffect(() => {
    if (hasPermission && isActive) {
      motionDetection.startDetection();
    } else {
      motionDetection.stopDetection();
    }
  }, [hasPermission, motionDetection, isActive]);

  return {
    videoRef,
    canvasRef,
    hasPermission,
    error
  };
};
