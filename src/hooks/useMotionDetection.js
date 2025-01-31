import { useCallback, useRef, useEffect } from 'react';

export const useMotionDetection = ({
  videoRef,
  canvasRef,
  onMotionDetected,
  sensitivity = 30,
  cooldownPeriod = 150
}) => {
  const animationFrameRef = useRef(null);
  const lastDetectionRef = useRef(0);
  const previousImageDataRef = useRef(null);

  const detectMotion = useCallback((prevData, currentData) => {
    let diff = 0;
    const length = prevData.length;
    
    // Compare every 4th pixel (RGBA values)
    for (let i = 0; i < length; i += 4) {
      const prevGray = (prevData[i] + prevData[i + 1] + prevData[i + 2]) / 3;
      const currentGray = (currentData[i] + currentData[i + 1] + currentData[i + 2]) / 3;
      diff += Math.abs(currentGray - prevGray);
    }
    
    return diff / (length / 4); // Average difference per pixel
  }, []);

  const processFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || video.readyState !== 4) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Match canvas size to video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current frame
    ctx.drawImage(video, 0, 0);
    
    // Get current frame data
    const currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Skip first frame since we need two frames to compare
    if (!previousImageDataRef.current) {
      previousImageDataRef.current = currentImageData;
      animationFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const now = Date.now();
    const timeSinceLastDetection = now - lastDetectionRef.current;

    // Only process if we're outside the cooldown period
    if (timeSinceLastDetection >= cooldownPeriod) {
      const motionScore = detectMotion(
        previousImageDataRef.current.data,
        currentImageData.data
      );

      if (motionScore > sensitivity) {
        lastDetectionRef.current = now;
        onMotionDetected();
      }
    }

    // Store current frame for next comparison
    previousImageDataRef.current = currentImageData;
    
    // Continue the detection loop
    animationFrameRef.current = requestAnimationFrame(processFrame);
  }, [videoRef, canvasRef, onMotionDetected, sensitivity, cooldownPeriod, detectMotion]);

  const startDetection = useCallback(() => {
    if (!animationFrameRef.current) {
      processFrame();
    }
  }, [processFrame]);

  const stopDetection = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    previousImageDataRef.current = null;
    lastDetectionRef.current = 0;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, [stopDetection]);

  return {
    startDetection,
    stopDetection
  };
};