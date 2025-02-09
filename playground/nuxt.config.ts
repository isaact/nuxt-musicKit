export default defineNuxtConfig({
  modules: ['../src/module'],
  musicKit: {
    developerKey: process.env.APPLE_MUSIC_PRIVATE_KEY,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    appName: process.env.APPLE_APP_NAME,
    appBuild: process.env.APPLE_APP_BUILD,
  },
  devtools: { enabled: true },
  compatibilityDate: '2025-01-10',
})