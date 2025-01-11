import { defineNuxtPlugin, useRuntimeConfig, useHead } from '#app'
import type { ModuleOptions } from '../module'
import { generateDeveloperToken } from './server/utils/musicKit'

export default defineNuxtPlugin(async (_nuxtApp) => {
  // console.log('Plugin injected by my-module!')
  const config = useRuntimeConfig()
  const musicKit = config.musicKit

  if (!musicKit) {
    console.warn('musicKit configuration is not available')
    return
  }

  const { developerKey, teamID, keyID } = musicKit as ModuleOptions
  const token = await generateDeveloperToken(developerKey, teamID, keyID)

  useHead({
    meta: [
      { name: 'apple-music-developer-token', content: token },
    ]
  })
})
