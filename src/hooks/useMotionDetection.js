import { useState, useRef, useCallback } from 'react';
import { createROIMask, rgbToGrayscale } from '../utils/motionDetection';

export const useMotionDetection = ({ onMotionDetected, sensitivity = 30, cooldownPeriod = 500 }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const previousFrameRef = useRef(null);
  const roiMaskRef = useRef(null);
  const lastDetectionRef = useRef(0);

  // Initialize or update ROI mask when dimensions change
  const initROIMask = useCallback((width, height) => {
    roiMaskRef.current = createROIMask(width, height);
  }, []);

  const detectMotion = useCallback((currentFrame) => {
    if (!currentFrame) return;

    const { width, height, data: currentData } = currentFrame;
    
    // Initialize mask if needed
    if (!roiMaskRef.current) {
      initROIMask(width, height);
    }

    // Skip if we're in cooldown period
    const now = Date.now();
    if (now - lastDetectionRef.current < cooldownPeriod) {
      return;
    }

    // Convert current frame to grayscale
    const currentGrayscale = new Uint8Array(width * height);
    for (let i = 0; i < currentData.length; i += 4) {
      const idx = i / 4;
      currentGrayscale[idx] = rgbToGrayscale(
        currentData[i],
        currentData[i + 1],
        currentData[i + 2]
      );
    }

    // Skip if this is the first frame
    if (!previousFrameRef.current) {
      previousFrameRef.current = currentGrayscale;
      return;
    }

    // Calculate difference between frames
    let motionScore = 0;
    let pixelsChecked = 0;

    for (let i = 0; i < currentGrayscale.length; i++) {
      // Only check pixels in ROI
      if (roiMaskRef.current[i]) {
        const diff = Math.abs(currentGrayscale[i] - previousFrameRef.current[i]);
        if (diff > 20) { // Threshold for pixel-level change
          motionScore += diff;
        }
        pixelsChecked++;
      }
    }

    // Update previous frame
    previousFrameRef.current = currentGrayscale;

    // Calculate average motion and check if it exceeds threshold
    const averageMotion = motionScore / pixelsChecked;
    if (averageMotion > sensitivity) {
      lastDetectionRef.current = now;
      onMotionDetected();
    }
  }, [sensitivity, cooldownPeriod, onMotionDetected, initROIMask]);

  const resetDetection = useCallback(() => {
    previousFrameRef.current = null;
    lastDetectionRef.current = 0;
  }, []);

  return {
    detectMotion,
    resetDetection,
    isProcessing,
    setIsProcessing
  };
};
