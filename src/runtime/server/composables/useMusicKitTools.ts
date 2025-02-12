// import { isTokenExpired } from '../utils/musicKit'
import { generateDeveloperToken, useRuntimeConfig } from "#imports";


export async function useMusicKitTools(): Promise<MusicKitConfig> {
    const config = useRuntimeConfig()
    // Ensure the keys exist in the config
    const { appName, appBuild, developerKey, teamID, keyID } = config.musicKit as MusicKitServerConfig
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