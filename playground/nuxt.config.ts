export default defineNuxtConfig({
  modules: ['../src/module'],
  musicKit: {
    developerKey: process.env.MUSIC_KIT_DEVELOPER_KEY,
    teamID: process.env.MUSIC_KIT_TEAM_ID,
    keyID: process.env.MUSIC_KIT_KEY_ID,
    appName: process.env.MUSIC_KIT_APP_NAME,
    appBuild: process.env.MUSIC_KIT_APP_BUILD,
  },
  devtools: { enabled: true },
  compatibilityDate: '2025-01-10',
})