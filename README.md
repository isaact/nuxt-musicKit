# Nuxt MusicKit

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt module for integrating Apple MusicKit JS into your Nuxt application.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## Features

- 🎵 &nbsp;Seamless MusicKit JS integration
- 🔐 &nbsp;Server-side token management
- 🎧 &nbsp;Reactive MusicKit state with useMusicKit composable
- 🚀 &nbsp;TypeScript support with MusicKit types

## Quick Setup

1. Install the module:

```bash
npx nuxi module add nuxt-musicKit
```

2. Configure your MusicKit credentials in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-musicKit'],
  
  musicKit: {
    developerKey: process.env.MUSIC_KIT_DEVELOPER_KEY,
    teamID: process.env.MUSIC_KIT_TEAM_ID,
    keyID: process.env.MUSIC_KIT_KEY_ID,
    appName: process.env.MUSIC_KIT_APP_NAME,
    appBuild: process.env.MUSIC_KIT_APP_BUILD
  }
})
```

3. Use the `useMusicKit` composable with proper initialization:

```vue
<script setup>
const { getInstance, musicKitConnected, tokenExpired } = useMusicKit()

async function playSong() {
  const musicKit = await getInstance()
  if (musicKit) {
    await musicKit.setQueue({ song: '123456789' })
    await musicKit.play()
  }
}
</script>

<template>
  <button @click="playSong" :disabled="!musicKitConnected || tokenExpired">
    Play Song
  </button>
</template>
```

**Available Composables:**
- `getInstance(): Promise<MusicKitInstance>` - Initialize and get MusicKit instance
- `musicKitConnected: Ref<boolean>` - Connection status
- `tokenExpired: Ref<boolean>` - Dev token expiration state

## Obtaining MusicKit Credentials

To use this module, you'll need to create a MusicKit key in your Apple Developer account:

1. Go to the [Apple Developer MusicKit Page](https://developer.apple.com/musickit/)
2. Create a new MusicKit key in your [Developer Account](https://developer.apple.com/account/resources/authkeys/list)
3. Download the .p8 file and note the following information:
   - **Key ID**: Found in the key details
   - **Team ID**: Your Apple Developer Team ID
   - **Developer Key**: Contents of the .p8 file
4. Set up environment variables in your project:

```bash
# .env file
MUSIC_KIT_DEVELOPER_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
MUSIC_KIT_TEAM_ID="YOUR_TEAM_ID"
MUSIC_KIT_KEY_ID="YOUR_KEY_ID"
MUSIC_KIT_APP_NAME="Your App Name"
MUSIC_KIT_APP_BUILD="1.0"
```
## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run Vitest
  npm run test
  npm run test:watch
  ```
</details>

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-musickit/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-musickit

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-musickit.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-musickit

[license-src]: https://img.shields.io/npm/l/nuxt-musicKit.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-musickit

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
