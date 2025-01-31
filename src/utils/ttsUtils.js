// ttsUtils.js
const API_KEY = process.env.REACT_APP_API_KEY;
//const VOICE_ID = "21m00Tcm4TlvDq8ikWAM";
const VOICE_ID = "EXAVITQu4vr4xnSDxMaL";

// Single shared audio context
let sharedAudioContext = null;

// Initialize audio context with iOS compatibility
export const getAudioContext = () => {
  if (!sharedAudioContext) {
    // Create new context with iOS-compatible options
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    sharedAudioContext = new AudioContext({
      // iOS optimization options
      sampleRate: 44100,
      latencyHint: 'interactive'
    });
  }
  return sharedAudioContext;
};

// Ensure audio context is running
const ensureAudioContextRunning = async () => {
  const context = getAudioContext();
  if (context.state === 'suspended') {
    await context.resume();
  }
  return context;
};

// Function to play audio buffer with iOS compatibility
const playAudioBuffer = async (buffer) => {
  try {
    const context = await ensureAudioContextRunning();
    
    // Create and configure source
    const source = context.createBufferSource();
    source.buffer = buffer;
    
    // Create gain node for volume control
    const gainNode = context.createGain();
    gainNode.gain.value = 1.0; // Full volume
    
    // Connect nodes
    source.connect(gainNode);
    gainNode.connect(context.destination);
    
    // Start playback
    source.start(0);
    
    return new Promise((resolve, reject) => {
      source.onended = resolve;
      source.onerror = reject;
    });
  } catch (error) {
    console.error('Error playing audio:', error);
    throw error;
  }
};

export const playMilestoneAnnouncement = async (count) => {
  if (!API_KEY) {
    console.error('ElevenLabs API key not found');
    return;
  }

  try {
    // Ensure audio context is running before making API call
    await ensureAudioContextRunning();

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': API_KEY
        },
        body: JSON.stringify({
          text: `${count}!`,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.71,
            similarity_boost: 0.5
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API Error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get array buffer from response
    const arrayBuffer = await response.arrayBuffer();
    
    // Decode the audio data
    const context = getAudioContext();
    const audioBuffer = await context.decodeAudioData(arrayBuffer);
    
    // Play the audio
    await playAudioBuffer(audioBuffer);

  } catch (error) {
    console.error('Error playing milestone announcement:', error);
    throw error;
  }
};