import { defineNuxtPlugin, useRuntimeConfig, useHead } from '#app'
import type { ModuleOptions } from '../module'
import { generateDeveloperToken } from './server/utils/musicKit'

export default defineNuxtPlugin(async (_nuxtApp) => {
  const config = useRuntimeConfig()
  const musicKitOptions = config.musicKit

  if (!musicKitOptions) {
    console.warn('musicKit configuration is not available')
    return
  }

  const { developerKey, teamID, keyID } = musicKitOptions as ModuleOptions
  const token = await generateDeveloperToken(developerKey, teamID, keyID)

  useHead({
    meta: [
      { name: 'apple-music-developer-token', content: token },
    ]
  })

})
