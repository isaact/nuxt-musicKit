import { generateDeveloperToken } from '../utils/musicKit'
// import { useRuntimeConfig } from "#imports";
import type { MusicKitConfig, MusicKitServerConfig } from '~/src/types/musicKit'

export async function generateMusicKitConfig(musicKitConfig:MusicKitServerConfig): Promise<MusicKitConfig> { // Returns Promise due to async token generation
    // const config = useRuntimeConfig()
    // Ensure the keys exist in the config
    const { appName, appBuild, developerKey, teamID, keyID } = musicKitConfig
    if (!developerKey || !teamID || !keyID || !appName || !appBuild) {
      throw new Error('Missing required musicKitLoader keys in runtime config.')
    }

    // Generate fresh developer token
    const developerToken = await generateDeveloperToken(developerKey, teamID, keyID)

    return {
      developerToken,
      app: {
        name: appName,
        build: appBuild
      }
    }
}
