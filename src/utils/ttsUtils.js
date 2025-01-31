// ttsUtils.js
const API_KEY = process.env.REACT_APP_API_KEY;
const VOICE_ID = "EXAVITQu4vr4xnSDxMaL";

let sharedAudioContext = null;
let isCurrentlyPlaying = false; // Add this flag to track playback state

export const getAudioContext = () => {
  if (!sharedAudioContext) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    sharedAudioContext = new AudioContext({
      sampleRate: 44100,
      latencyHint: 'interactive'
    });
  }
  return sharedAudioContext;
};

const ensureAudioContextRunning = async () => {
  const context = getAudioContext();
  if (context.state === 'suspended') {
    await context.resume();
  }
  return context;
};

const playAudioBuffer = async (buffer) => {
  try {
    const context = await ensureAudioContextRunning();
    
    const source = context.createBufferSource();
    source.buffer = buffer;
    
    const gainNode = context.createGain();
    gainNode.gain.value = 1.0;
    
    source.connect(gainNode);
    gainNode.connect(context.destination);
    
    source.start(0);
    
    return new Promise((resolve, reject) => {
      source.onended = () => {
        isCurrentlyPlaying = false; // Reset flag when playback ends
        resolve();
      };
      source.onerror = (error) => {
        isCurrentlyPlaying = false; // Reset flag on error
        reject(error);
      };
    });
  } catch (error) {
    isCurrentlyPlaying = false; // Reset flag on error
    console.error('Error playing audio:', error);
    throw error;
  }
};

export const playMilestoneAnnouncement = async (count) => {
  // If already playing, skip this announcement
  if (isCurrentlyPlaying) {
    console.log('Skipping announcement - audio already playing');
    return;
  }

  if (!API_KEY) {
    console.error('ElevenLabs API key not found');
    return;
  }

  try {
    isCurrentlyPlaying = true; // Set flag before starting playback
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
      isCurrentlyPlaying = false; // Reset flag on error
      const errorText = await response.text();
      console.error('ElevenLabs API Error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const context = getAudioContext();
    const audioBuffer = await context.decodeAudioData(arrayBuffer);
    
    await playAudioBuffer(audioBuffer);

  } catch (error) {
    isCurrentlyPlaying = false; // Reset flag on error
    console.error('Error playing milestone announcement:', error);
    throw error;
  }
};