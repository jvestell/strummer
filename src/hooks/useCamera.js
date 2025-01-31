import { useState, useCallback } from 'react';

export const useCamera = (videoRef) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream, videoRef]);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      
      // Check for Safari and HTTPS
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const isHttps = window.location.protocol === 'https:';
      
      if (isSafari && !isHttps) {
        throw new Error('Safari requires HTTPS to access the camera');
      }

      const constraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Wait for video to be ready
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = resolve;
        });
        await videoRef.current.play();
      }

      setHasPermission(true);
    } catch (err) {
      console.error('Camera access error:', err);
      
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please enable camera permissions.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please ensure your device has a camera.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is in use by another application.');
      } else {
        setError(`Camera error: ${err.message || 'Could not access camera'}`);
      }
      
      setHasPermission(false);
    }
  }, [videoRef]);

  const requestPermission = useCallback(() => {
    startCamera();
  }, [startCamera]);

  return {
    hasPermission,
    requestPermission,
    startCamera,
    stopCamera,
    error
  };
};