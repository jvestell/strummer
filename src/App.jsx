import React, { useState } from 'react';
import { Camera } from './components/Camera/Camera';
import { Counter } from './components/Counter/Counter';
import { Metronome } from './components/Metronome/Metronome';

const App = () => {
  const [strumCount, setStrumCount] = useState(0);
  const [bpm, setBpm] = useState(60);
  const [isActive, setIsActive] = useState(false);

  const handleStrumDetected = () => {
    setStrumCount(prevCount => prevCount + 1);
  };

  const handleBpmChange = (newBpm) => {
    setBpm(newBpm);
  };

  const handleStartStop = () => {
    setIsActive(prev => !prev);
    if (!isActive) {
      setStrumCount(0); // Reset counter when starting
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-center mb-4">Strum Counter</h1>
          
          <div className="space-y-4">
            <Camera 
              isActive={isActive}
              onStrumDetected={handleStrumDetected}
            />
            
            <Counter count={strumCount} />
            
            <Metronome 
              bpm={bpm}
              isActive={isActive}
              onBpmChange={handleBpmChange}
            />
            
            <button
              onClick={handleStartStop}
              className={`w-full py-2 px-4 rounded-md font-semibold text-white ${
                isActive 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isActive ? 'Stop' : 'Start'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;