import 'musickit-js';

declare global {
  interface Window {
    MusicKit: typeof MusicKit;
  }
}