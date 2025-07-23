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
