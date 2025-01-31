import { useState, useRef, useCallback } from 'react';
import { createROIMask, rgbToGrayscale } from '../utils/motionDetection';

export const useMotionDetection = ({ 
  onMotionDetected, 
  sensitivity = 25,         // Slightly lower sensitivity
  cooldownPeriod = 300,    // Faster cooldown for rapid strums
  minMotionDuration = 50   // New parameter for minimum motion duration
}) => {
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

    // Add directional analysis
    let verticalMotion = 0;
    let horizontalMotion = 0;

    for (let i = 0; i < currentGrayscale.length; i++) {
      if (roiMaskRef.current[i]) {
        const diff = Math.abs(currentGrayscale[i] - previousFrameRef.current[i]);
        if (diff > 20) {
          const x = i % width;
          const y = Math.floor(i / width);
          
          // Calculate directional components
          if (i + 1 < currentGrayscale.length) {
            horizontalMotion += Math.abs(currentGrayscale[i + 1] - currentGrayscale[i]);
          }
          if (i + width < currentGrayscale.length) {
            verticalMotion += Math.abs(currentGrayscale[i + width] - currentGrayscale[i]);
          }
          
          motionScore += diff;
          pixelsChecked++;
        }
      }
    }

    // Check if motion matches strum pattern
    const isStrumMotion = 
      horizontalMotion > verticalMotion * 1.5 && // More horizontal than vertical motion
      motionScore > sensitivity * pixelsChecked;

    if (isStrumMotion) {
      if (now - lastDetectionRef.current >= cooldownPeriod) {
        lastDetectionRef.current = now;
        onMotionDetected();
      }
    }

    // Update previous frame
    previousFrameRef.current = currentGrayscale;
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
