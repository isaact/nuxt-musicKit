import MyModule from '../../../src/module'
import type { ModuleOptions } from '../../../src/module'

declare module '@nuxt/schema' {
  interface NuxtConfig {
    musicKit?: ModuleOptions
  }
}

export default defineNuxtConfig({
  modules: [
    MyModule,
  ],
  musicKit: {
    developerKey: process.env.MUSIC_KIT_DEVELOPER_KEY || 'mock_developer_key',
    teamID: process.env.MUSIC_KIT_TEAM_ID || 'mock_team_id',
    keyID: process.env.MUSIC_KIT_KEY_ID || 'mock_key_id',
    appName: process.env.MUSIC_KIT_APP_NAME || 'Test App',
    appBuild: process.env.MUSIC_KIT_APP_BUILD || '1.0'
  }
})
