import { useCallback, useRef } from 'react';
import { detectMotion } from '../utils/motionDetection';

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
    const currentImageData = ctx.getImageData(
      0, 
      0, 
      canvas.width, 
      canvas.height
    );

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
  }, [videoRef, canvasRef, onMotionDetected, sensitivity, cooldownPeriod]);

  const startDetection = useCallback(() => {
    // Reset refs
    lastDetectionRef.current = 0;
    previousImageDataRef.current = null;
    
    // Start the detection loop
    processFrame();
  }, [processFrame]);

  const stopDetection = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    // Clear refs
    previousImageDataRef.current = null;
  }, []);

  return {
    startDetection,
    stopDetection
  };
};