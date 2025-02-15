// Define the MusicKit API Response
interface MusicKitApiResponse {
  data: object; // Adjust this type as per your needs or specific API response structures
  request: object;
  response: Response;
}

// Enum for Playback State
enum PlaybackState {
  Stopped = 0,
  Playing = 1,
  Paused = 2,
  Buffering = 3,
  Seeking = 4,
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
  playbackState: PlaybackState;
}

// Define the MusicKit server config
interface MusicKitServerConfig {
  appName: string;
  appBuild: string;
  developerKey: string;
  teamID: string;
  keyID: string;
}

// Define the configuration for MusicKit
interface MusicKitConfig {
  developerToken: string;
  app: {
    name: string;
    build: string;
  };
}

interface FetchMusicKitConfig {
  (): Promise<MusicKitConfig>;
}

// Options for setting the queue
interface MusicKitSetQueueOptions {
  song: string;
  album?: string;
  playlist?: string;
}

// Define a media item in the queue
interface MusicKitAlbum extends MusicKitMediaItem {
  attributes: {
    name: string;
    artistName: string;
    artwork: MusicKitArtwork;
    releaseDate: string;
    songs?: MusicKitMediaItem[];
  };
}

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

// Song, Playlist, Album, and Artist Types

interface MusicKitSong {
  id: string;
  title: string;
  albumName: string;
  artistName: string;
  artwork: MusicKitArtwork;
  duration: number; // Duration in seconds
  url: string; // The URL of the song
}

interface MusicKitPlaylist {
  id: string;
  name: string;
  description: string;
  artwork: MusicKitArtwork;
  songs: MusicKitSong[];
}

interface MusicKitAlbum {
  id: string;
  title: string;
  artistName: string;
  artwork: MusicKitArtwork;
  releaseDate: string;
  songs: MusicKitSong[];
}

interface MusicKitArtist {
  id: string;
  name: string;
  artwork: MusicKitArtwork;
  albums: MusicKitAlbum[];
  playlists: MusicKitPlaylist[];
}

// Extend the window object to include MusicKit
declare global {
  interface Window {
    MusicKit: {
      configure(config: MusicKitConfig): Promise<void>;
      getInstance(): MusicKitInstance;
    };
  }
}

// Export all interfaces and types from this file
export {
  MusicKitApiResponse,
  MusicKitInstance,
  MusicKitServerConfig,
  MusicKitConfig,
  FetchMusicKitConfig,
  MusicKitSetQueueOptions,
  MusicKitMediaItem,
  MusicKitArtwork,
  MusicKitQueue,
  MusicKitSong,
  MusicKitPlaylist,
  MusicKitAlbum,
  MusicKitArtist,
  PlaybackState,
};
