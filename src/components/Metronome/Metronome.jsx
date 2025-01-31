import React from 'react';
import { MinusCircle, PlusCircle, Volume2, VolumeX } from 'lucide-react';
import { useMetronome } from '../../hooks/useMetronome';

export const Metronome = ({ 
  bpm, 
  isActive, 
  onBpmChange, 
  soundEnabled = true,
  onSoundToggle,
  compact = false 
}) => {
  // Initialize metronome hook with sound control
  useMetronome({
    bpm,
    isActive,
    enabled: soundEnabled
  });

  const handleBpmChange = (amount) => {
    const newBpm = Math.min(Math.max(30, bpm + amount), 240);
    onBpmChange(newBpm);
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2">
        <button
          onClick={() => onBpmChange(Math.max(30, bpm - 5))}
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
          disabled={!isActive}
        >
          <MinusCircle className="w-5 h-5" />
        </button>
        
        <div className="flex flex-col items-center min-w-[4rem]">
          <div className="text-2xl font-bold text-gray-700 tabular-nums">
            {bpm}
          </div>
          <div className="text-xs font-medium text-gray-500">BPM</div>
        </div>

        <button
          onClick={() => onBpmChange(Math.min(240, bpm + 5))}
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
          disabled={!isActive}
        >
          <PlusCircle className="w-5 h-5" />
        </button>

        {onSoundToggle && (
          <button
            onClick={onSoundToggle}
            className={`p-1.5 rounded-full transition-colors ${
              soundEnabled 
                ? 'text-blue-500 hover:bg-blue-50' 
                : 'text-gray-400 hover:bg-gray-200'
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Volume2 
            className={`w-6 h-6 mr-2 ${isActive ? 'text-green-500' : 'text-gray-400'}`}
          />
          <h2 className="text-lg font-semibold text-gray-700">Tempo</h2>
        </div>
        <button
          onClick={onSoundToggle}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors
            ${soundEnabled 
              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          {soundEnabled ? 'Sound On' : 'Sound Off'}
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