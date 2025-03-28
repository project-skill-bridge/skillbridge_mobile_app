import { EventEmitter } from 'events';

// Create a global event emitter for audio controls
export const audioEvents = new EventEmitter();

// Event types
export const AUDIO_EVENTS = {
  STOP_ALL_AUDIO: 'STOP_ALL_AUDIO',
};