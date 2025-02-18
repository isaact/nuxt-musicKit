import { defineNuxtModule, createResolver, addImports, addServerImports, addImportsDir } from '@nuxt/kit'
import { defu } from 'defu'
import { generateMusicKitConfig } from './runtime/server/composables/useMusicKitConfig'


export type ModuleOptions = MusicKitServerConfig

export default defineNuxtModule({
  meta: {
    name: 'nuxt-musickit',
    configKey: 'musicKit',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    teamID: process.env.MUSIC_KIT_TEAM_ID,
    keyID: process.env.MUSIC_KIT_KEY_ID,
    appName: process.env.MUSIC_KIT_APP_NAME,
    appBuild: process.env.MUSIC_KIT_APP_BUILD,
    developerKey: process.env.MUSIC_KIT_DEVELOPER_KEY,
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.app.head.script ||= []
    // Extend Nuxt config to load the MusicKit.js library
    nuxt.options.app.head.script.push({
      src: 'https://js-cdn.music.apple.com/musickit/v3/musickit.js',
      defer: true,
      'data-web-components': true,
    });

    nuxt.options.runtimeConfig.musicKit = defu(nuxt.options.runtimeConfig.musicKit || {}, options)
    nuxt.options.runtimeConfig.public.musicKitConfig = await generateMusicKitConfig(nuxt.options.runtimeConfig.musicKit)
    
    addImports({
      name: 'useMusicKit', // name of the composable to be used
      as: 'useMusicKit',
      from: resolver.resolve('./runtime/composables/useMusicKit') // path of composable
    })
    addServerImports([{
      name: 'generateMusicKitConfig',
      as: 'generateMusicKitConfig',
      from: resolver.resolve('./runtime/server/composables/useMusicKitConfig')
    }])
    addImportsDir(resolver.resolve('./types'))
    
  },
})
