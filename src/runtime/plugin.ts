import { defineNuxtPlugin, useRuntimeConfig, useHead } from '#app'
import type { ModuleOptions } from '../module'
import { generateDeveloperToken } from './server/utils/musicKit'

export default defineNuxtPlugin((_nuxtApp) => {
  // console.log('Plugin injected by my-module!')
  const config = useRuntimeConfig()
  console.log(config)
  const musicKitLoader = config.musicKit as ModuleOptions
  const { developerKey, teamID, keyID } = musicKitLoader
  const token = generateDeveloperToken(developerKey, teamID, keyID)
  useHead({
    meta: [
      { name: 'apple-music-developer-token', content: token },
    ]
   })
})
