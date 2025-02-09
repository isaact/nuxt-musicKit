// Define the MusicKit API Response
interface MusicKitApiResponse {
  data: object; // Adjust this type as per your needs or specific API response structures
  request: object;
  response: Response
}

// Define the MusicKit instance interface
interface MusicKitInstance {
  developerToken: string;
  userToken: string | null;
  // Define other properties here if needed

  // API object for making requests to Apple Music
  api: {
    music(path: string, options?: RequestInit): Promise<MusicKitApiResponse>;
  };

  // Methods related to playback
  play(): Promise<void>;
  pause(): Promise<void>;
  stop(): Promise<void>;
  skipToNextItem(): Promise<void>;
  skipToPreviousItem(): Promise<void>;

  // Queue control
  setQueue(options: MusicKitSetQueueOptions): Promise<MusicKitMediaItem[]>;
  getQueue(): MusicKitQueue;

  // Authorization methods
  authorize(): Promise<string>; // Resolves to userToken
  unauthorize(): void;

  // Get playback state
  playbackState: number; // This can be typed as an enum if needed
}

// Define the configuration for MusicKit
interface MusicKitConfiguration {
  developerToken: string;
  app: {
    name: string;
    build: string;
  };
}

interface FetchMusicKitConfig {
  (): Promise<MusicKitConfiguration>;
}

// Options for setting the queue
interface MusicKitSetQueueOptions {
  song: string;
  album?: string;
  playlist?: string;
}

// Define a media item in the queue
interface MusicKitMediaItem {
  id: string;
  type: string;
  attributes: {
    title: string;
    albumName: string;
    artistName: string;
    artwork: MusicKitArtwork;
  };
}

// Artwork structure
interface MusicKitArtwork {
  url: string;
  width: number;
  height: number;
}

// Define the queue
interface MusicKitQueue {
  items: MusicKitMediaItem[];
  currentItem: MusicKitMediaItem;
}

// Extend the window object to include MusicKit
declare global {
  interface Window {
    MusicKit: {
      configure(config: MusicKitConfiguration): Promise<void>;
      getInstance(): MusicKitInstance;
    };
  }
}
