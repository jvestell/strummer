import React, { useState, useEffect } from 'react';
import { Counter } from './components/Counter/Counter';
import { Metronome } from './components/Metronome/Metronome';

const App = () => {
  const [strumCount, setStrumCount] = useState(0);
  const [bpm, setBpm] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Handle metronome beats and strum counting
  useEffect(() => {
    if (!isActive) return;

    const interval = (60 / bpm) * 1000; // Convert BPM to milliseconds
    const beatInterval = setInterval(() => {
      setStrumCount(prev => prev + 2); // Increment by 2 for up/down strums
    }, interval);

    return () => clearInterval(beatInterval);
  }, [isActive, bpm]);

  const handleStartStop = () => {
    setIsActive(prev => !prev);
    if (!isActive) {
      setStrumCount(0); // Reset counter when starting
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