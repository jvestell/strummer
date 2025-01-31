/**
 * Detects motion between two frames by comparing pixel differences
 * @param {Uint8ClampedArray} previous - Previous frame's pixel data
 * @param {Uint8ClampedArray} current - Current frame's pixel data
 * @returns {number} - Motion score (higher means more motion)
 */
export const detectMotion = (previous, current) => {
    // Ensure we have valid data
    if (!previous || !current || previous.length !== current.length) {
      return 0;
    }
  
    let score = 0;
    let changedPixels = 0;
    
    // We'll sample every 4th pixel (every 16th value since each pixel has 4 values: R,G,B,A)
    // This improves performance while still maintaining good detection
    for (let i = 0; i < previous.length; i += 16) {
      // Compare RGB values (skip alpha)
      const diffR = Math.abs(previous[i] - current[i]);
      const diffG = Math.abs(previous[i + 1] - current[i + 1]);
      const diffB = Math.abs(previous[i + 2] - current[i + 2]);
      
      // Calculate average difference for this pixel
      const pixelDiff = (diffR + diffG + diffB) / 3;
      
      // Only count significant changes (reduces noise)
      if (pixelDiff > 25) { // Threshold for significant change
        score += pixelDiff;
        changedPixels++;
      }
    }
    
    // Normalize the score based on the number of pixels that changed
    // This helps prevent false positives from small, intense changes
    return (score * changedPixels) / (previous.length / 16);
  };
  
  /**
   * Creates a region of interest mask for more focused motion detection
   * @param {number} width - Width of the frame
   * @param {number} height - Height of the frame
   * @returns {Uint8ClampedArray} - Mask data where 1 indicates ROI
   */
  export const createROIMask = (width, height) => {
    const mask = new Uint8ClampedArray(width * height);
    
    // Define the region of interest (middle third of the screen)
    const roiStartX = width * 0.33;
    const roiEndX = width * 0.67;
    const roiStartY = height * 0.2;
    const roiEndY = height * 0.8;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        mask[index] = (
          x >= roiStartX && 
          x <= roiEndX && 
          y >= roiStartY && 
          y <= roiEndY
        ) ? 1 : 0;
      }
    }
    
    return mask;
  };
  
  /**
   * Utility to convert RGB values to grayscale
   * @param {number} r - Red value
   * @param {number} g - Green value
   * @param {number} b - Blue value
   * @returns {number} - Grayscale value
   */
  export const rgbToGrayscale = (r, g, b) => {
    // Using luminosity method: 0.21 R + 0.72 G + 0.07 B
    return (0.21 * r + 0.72 * g + 0.07 * b);
  };