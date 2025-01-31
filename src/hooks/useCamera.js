import { useState, useRef, useEffect } from 'react';

export const useCamera = () => {
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(document.createElement('canvas'));
  const contextRef = useRef(null);

  useEffect(() => {
    // Initialize canvas context for frame capture
    contextRef.current = canvasRef.current.getContext('2d', { willReadFrequently: true });
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 320 },
          height: { ideal: 240 },
          facingMode: 'user',
          frameRate: { ideal: 30 }
        }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsReady(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setIsReady(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsReady(false);
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || !isReady) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = contextRef.current;

    // Set canvas size to match video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get frame data
    return context.getImageData(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return {
    videoRef,
    isReady,
    captureFrame,
    startCamera,
    stopCamera
  };
};
