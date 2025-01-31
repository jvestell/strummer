import React, { useState, useEffect, useCallback } from 'react';
import { Counter } from './components/Counter/Counter';
import { Metronome } from './components/Metronome/Metronome';
import { playMilestoneAnnouncement, getAudioContext } from './utils/ttsUtils';

const App = () => {
  const [strumCount, setStrumCount] = useState(0);
  const [bpm, setBpm] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Initialize audio context on first user interaction
  const initAudio = useCallback(async () => {
    try {
      const context = getAudioContext();
      if (context.state === 'suspended') {
        await context.resume();
      }
      setAudioInitialized(true);
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }, []);

  // Handle metronome beats and strum counting
  useEffect(() => {
    if (!isActive || !audioInitialized) return;

    const interval = (60 / bpm) * 1000;
    const beatInterval = setInterval(() => {
      setStrumCount(prev => {
        const newCount = prev + 2;
        // Check if we've hit a milestone
        if (newCount % 100 === 0 && soundEnabled) {
          playMilestoneAnnouncement(newCount).catch(error => {
            console.error('Failed to play announcement:', error);
          });
        }
        return newCount;
      });
    }, interval);

    return () => clearInterval(beatInterval);
  }, [isActive, bpm, audioInitialized, soundEnabled]);

  const handleStartStop = async () => {
    if (!audioInitialized) {
      await initAudio(); // Initialize audio on first interaction
    }
    setIsActive(prev => !prev);
    if (!isActive) {
      setStrumCount(0);
    }
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handleStartStop}
              className={`px-6 py-2.5 rounded-full font-semibold text-white shadow-sm transition-all transform hover:scale-105 ${
                isActive 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isActive ? 'Stop' : 'Start'}
            </button>
            
            <Metronome 
              bpm={bpm}
              isActive={isActive}
              onBpmChange={setBpm}
              soundEnabled={soundEnabled}
              onSoundToggle={toggleSound}
              compact={true}
            />
          </div>
          
          <Counter count={strumCount} />
        </div>
      </div>
    </div>
  );
};

export default App;