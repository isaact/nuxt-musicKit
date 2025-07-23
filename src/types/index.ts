// Define the MusicKit API Response
export interface MusicKitApiResource<T> {
  data: T[];
}

export interface MusicKitApiResponse {
  data: MusicKitApiResource<MusicKitMediaItem>;
  request: object;
  response: Response;
}

// Enum for Playback State
export enum PlaybackState {
  Stopped = 0,
  Playing = 1,
  Paused = 2,
  Buffering = 3,
  Seeking = 4,
}

// Define the MusicKit instance interface
export interface MusicKitInstance {
  developerToken: string;
  userToken: string | null;

  // API object for making requests to Apple Music
  api: {
    music(path: string, options?: RequestInit): Promise<MusicKitApiResponse>;
  };

  // Methods related to playback
  play(): Promise<void>;
  pause(): Promise<void>;
  stop(): Promise<void>;
  storefrontId: string;
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
export interface MusicKitServerConfig {
  appName: string;
  appBuild: string;
  developerKey: string;
  teamID: string;
  keyID: string;
}
// Define the configuration for MusicKit
export interface MusicKitConfig {
  developerToken: string;
  app: {
    name: string;
    build: string;
  };
}

export interface FetchMusicKitConfig {
  (): Promise<MusicKitConfig>;
}

// Options for setting the queue
export interface MusicKitSetQueueOptions {
  song: string;
  album?: string;
  playlist?: string;
}

// Artwork structure
export interface MusicKitArtwork {
  url: string;
  width: number;
  height: number;
}

// Define a media item (song, album, playlist, etc.)
export interface MusicKitMediaItem {
  id: string;
  type: 'song' | 'album' | 'playlist' | 'artist'; // Type could be any of these
  // attributes: {
  //   title: string;
  //   albumName: string;
  //   artistName: string;
  //   artwork: MusicKitArtwork;
  // };
}

// Define the queue
export interface MusicKitQueue {
  items: MusicKitMediaItem[];
  currentItem: MusicKitMediaItem;
}

// Song, Playlist, Album, and Artist Types

export interface MusicKitSong extends MusicKitMediaItem {
  attributes: {
    title: string;
    albumName: string;
    artistName: string;
    artwork: MusicKitArtwork;
    duration: number; // Duration in seconds
    url: string; // URL of the song
  };
}

export interface MusicKitPlaylist extends MusicKitMediaItem {
  attributes: {
    name: string;
    description?: {
      standard: string;
    };
    artwork: MusicKitArtwork;
    songs?: MusicKitSong[];
  };
}

export interface MusicKitAlbum extends MusicKitMediaItem {
  attributes: {
    title: string;
    artistName: string;
    artwork: MusicKitArtwork;
    releaseDate: string;
    songs: MusicKitSong[];
  };
}

export interface MusicKitArtist extends MusicKitMediaItem {
  attributes: {
    name: string;
    artwork: MusicKitArtwork;
    albums: MusicKitAlbum[];
    playlists: MusicKitPlaylist[];
  };
}
declare global {

  // Extend the window object to include MusicKit
  interface Window {
    MusicKit: {
      configure(config: MusicKitConfig): Promise<void>;
      getInstance(): MusicKitInstance;
    };
  }
}

