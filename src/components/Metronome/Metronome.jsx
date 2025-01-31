import React from 'react';
import { Volume2, MinusCircle, PlusCircle } from 'lucide-react';
import { useMetronome } from '../../hooks/useMetronome';

export const Metronome = ({ bpm, isActive, onBpmChange }) => {
  const { isPlaying, toggleSound } = useMetronome({
    bpm,
    isActive
  });

  const handleBpmChange = (amount) => {
    const newBpm = Math.min(Math.max(30, bpm + amount), 240);
    onBpmChange(newBpm);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Volume2 
            className={`w-6 h-6 mr-2 ${isPlaying ? 'text-green-500' : 'text-gray-400'}`}
          />
          <h2 className="text-lg font-semibold text-gray-700">Tempo</h2>
        </div>
        <button
          onClick={toggleSound}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors
            ${isPlaying 
              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          {isPlaying ? 'Sound On' : 'Sound Off'}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => handleBpmChange(-5)}
          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Decrease BPM"
        >
          <MinusCircle className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold text-gray-700 tabular-nums">
            {bpm}
          </div>
          <div className="text-sm text-gray-500">BPM</div>
        </div>

        <button
          onClick={() => handleBpmChange(5)}
          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Increase BPM"
        >
          <PlusCircle className="w-6 h-6" />
        </button>
      </div>

      {/* BPM Slider */}
      <div className="mt-4">
        <input
          type="range"
          min="30"
          max="240"
          value={bpm}
          onChange={(e) => onBpmChange(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>30</span>
          <span>240</span>
        </div>
      </div>
    </div>
  );
};

// Add display name for dev tools
Metronome.displayName = 'Metronome';