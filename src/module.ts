import { defineNuxtModule, createResolver, addImports, addServerImports } from '@nuxt/kit'
import { defu } from 'defu'
// import { generateDeveloperToken } from './runtime/server/utils/musicKit'

// Module options TypeScript interface definition
// export type ModuleOptions = {
//   clientModeOnly?: boolean;
//   appName: string;
//   appBuild: string;
//   developerToken?:string;

  
//   developerKey?: string;
//   teamID?: string;
//   keyID?: string;
// };

// declare global {
//   interface PublicMusicKitConfig {
//     MUSICKIT_TOKEN: string
//     MUSICKIT_APP_NAME: string
//     MUSICKIT_APP_BUILD: string
//     MUSICKIT_TOKEN_API_URL: string
//   }
// }


export default defineNuxtModule({
  meta: {
    name: 'nuxt-musickit',
    configKey: 'musicKit',
  },
  // Default configuration options of the Nuxt module
  // defaults: {
  //   clientModeOnly: false,
  //   teamID: process.env.MUSIC_KIT_TEAM_ID,
  //   keyID: process.env.MUSIC_KIT_KEY_ID,
  //   appName: process.env.MUSIC_KIT_APP_NAME,
  //   appBuild: process.env.MUSIC_KIT_APP_BUILD,
  //   devTokenUrl: process.env.MUSIC_KIT_API_URL || '/api/musicKit-token',
  //   developerKey: process.env.MUSIC_KIT_DEVELOPER_KEY,
  // },
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
    // const musicKitOptions = nuxt.options.runtimeConfig.musicKit as ModuleOptions

    // if (musicKitOptions.clientModeOnly && musicKitOptions.devTokenUrl) {
    //   try {
    //     const response = await fetch(musicKitOptions.devTokenUrl);
    //     const tokenData = await response.json();
    //     token = tokenData.token;
    //     if (!token) {
    //       throw new Error('Invalid token response');
    //     }
    //   } catch (error) {
    //     console.warn('Failed to fetch developer token:', error);
    //     console.warn('MusicKit functionality will be limited without a valid token');
    //   }
    // } else if (musicKitOptions.developerKey && musicKitOptions.teamID && musicKitOptions.keyID) {
    //   try {
    //     token = await generateDeveloperToken(musicKitOptions.developerKey, musicKitOptions.teamID, musicKitOptions.keyID);
    //     if (musicKitOptions.devTokenUrl && !musicKitOptions.devTokenUrl.startsWith('http://') && !musicKitOptions.devTokenUrl.startsWith('https://')) {
    //       addServerHandler({
    //         route: musicKitOptions.devTokenUrl,
    //         handler: resolver.resolve('./runtime/server/api/token'),
    //       })
    //     }

    //   } catch (error) {
    //     console.warn('Failed to generate Apple Music developer token:', error);
    //     console.warn('MusicKit functionality will be limited without a valid token');
    //   }
    // } else {
    //   console.warn('Missing required Apple Music authentication credentials');
    //   console.warn('MusicKit functionality will be limited without a valid token');
    // }
    

    // // nuxt.options.runtimeConfig.public.musicKit ||= {}
    // nuxt.options.runtimeConfig.public.musicKit = defu(nuxt.options.runtimeConfig.public.musicKit as PublicMusicKitConfig, {
    //   MUSICKIT_TOKEN: token,
    //   MUSICKIT_APP_NAME: options.appName,
    //   MUSICKIT_APP_BUILD: options.appBuild,
    //   // MUSICKIT_TOKEN_API_URL: options.devTokenUrl
    // })

    addImports({
      name: 'useMusicKit', // name of the composable to be used
      as: 'useMusicKit',
      from: resolver.resolve('./runtime/composables/useMusicKit') // path of composable
    })
    // Server-side utilities
    addServerImports([{
      name: 'generateDeveloperToken',
      from: resolver.resolve('./runtime/server/utils/musicKit')
    }])
    addImports({
    // Client-side composables
      name: 'isTokenExpired',
      from: resolver.resolve('./runtime/utils/musicKit')
    })
  },
})
