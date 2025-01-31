import { useState, useEffect, useRef, useCallback } from 'react';

export const useMetronome = ({ bpm, isActive }) => {
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
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    // Set up sound properties
    oscillator.frequency.setValueAtTime(880, audioContextRef.current.currentTime); // A5 note
    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioContextRef.current.currentTime + 0.05
    );

    // Play sound
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + 0.05);
  }, []);

  // Start/stop metronome loop
  const updateMetronome = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isPlaying && isActive) {
      const intervalTime = (60 / bpm) * 1000;
      intervalRef.current = setInterval(playTick, intervalTime);
      playTick(); // Play first tick immediately
    }
  }, [bpm, isPlaying, isActive, playTick]);

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

  // Update metronome when BPM or playing state changes
  useEffect(() => {
    updateMetronome();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [bpm, isPlaying, isActive, updateMetronome]);

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
    isPlaying,
    toggleSound
  };
};