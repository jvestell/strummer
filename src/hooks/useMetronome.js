import { useState, useEffect, useRef, useCallback } from 'react';

export const useMetronome = ({ bpm, isActive, enabled = true }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef(null);
  const intervalRef = useRef(null);

  // Initialize audio context
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, []);

  // Create and play a tick sound
  const playTick = useCallback(() => {
    if (!audioContextRef.current || !enabled) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    // Create a filter for more wooden sound
    const filter = audioContextRef.current.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2400; // Emphasize wood-like frequencies
    filter.Q.value = 1.5;

    // Connect nodes: oscillator -> filter -> gain -> output
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    // Set up sound properties
    oscillator.type = "triangle"; // Use triangle wave for wooden character
    oscillator.frequency.setValueAtTime(1800, audioContextRef.current.currentTime);
    
    // Shorter, sharper attack for click sound
    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioContextRef.current.currentTime + 0.03
    );

    // Play sound
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + 0.03);
  }, [enabled]);

  // Start/stop metronome loop
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isActive && enabled) {
      initAudioContext();
      const intervalTime = (60 / bpm) * 1000;
      intervalRef.current = setInterval(playTick, intervalTime);
      playTick(); // Play first tick immediately
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [bpm, isActive, enabled, playTick, initAudioContext]);

  // Toggle sound on/off
  const toggleSound = useCallback(() => {
    if (!isPlaying) {
      initAudioContext();
      // Resume audio context if it was suspended
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
    }
    setIsPlaying(prev => !prev);
  }, [isPlaying, initAudioContext]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isPlaying: isActive && enabled,
    toggleSound
  };
};