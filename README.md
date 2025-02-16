# Nuxt MusicKit

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt module for integrating Apple MusicKit JS into your Nuxt application.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## Features

- 🎵 &nbsp;Seamless MusicKit JS integration
- 🔐 &nbsp;Server-side token management tools
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

## Server-Side Token Management

Create a server API route to handle token generation:

```ts
// server/api/token.ts
import { defineEventHandler, createError } from 'h3'
import { generateMusicKitConfig } from "#imports"

export default defineEventHandler(async (_) => {
  try {
    // Get pre-validated config with fresh token
    const musicKitConfig = await generateMusicKitConfig()
    return musicKitConfig

  } catch (error: unknown) {
    // Type narrow the error before accessing properties
    let message: string

    if (error instanceof Error) {
      // Handle the case where it's an Error object
      message = error.message
    } else {
      // Handle the case where the error is something else
      message = 'An unknown error occurred during token generation.'
    }
    
    // Throw a new error with a meaningful message
    throw createError({
      statusCode: 500,
      statusMessage: message
    })
  }
})

```

## Client-Side Implementation

Use the composable with your token endpoint:

```vue
<template>
  <div>
    <h1>Nuxt MusicKit Playground</h1>
    
    <div v-if="loading">
      Loading MusicKit...
    </div>
    
    <div v-if="!loading && musicKitLoaded">
      <div class="token-controls">
        <button :disabled="!tokenExpired" @click="renewToken">
          Renew Developer Token
        </button>
        <div :class="['token-status', { expired: tokenExpired }]">
          Token Status: {{ tokenExpired ? 'Expired' : 'Valid' }}
        </div>
        <div :class="['connected-status', { connected: musicKitConnected }]">
          MusicKit Status: {{ musicKitConnected ? 'Connected' : 'Not connected' }}
        </div>
      </div>
      
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search albums..."
          class="search-input"
        >
        <button :disabled="!searchQuery.length" @click="searchAlbums">
          search
        </button>
      </div>

      <div v-if="searchResults.length > 0" class="results-container">
        <h2>Search Results</h2>
        <ul class="album-list">
          <li
            v-for="album in searchResults"
            :key="album.id"
            class="album-item"
          >
            <div class="album-info">
              <img
                :src="album.attributes.artwork.url.replace('{w}x{h}', '100x100')"
                :alt="album.attributes.title"
                class="album-art"
              >
              <div class="album-details">
                <h3>{{ album.attributes.title }}</h3>
                <p>{{ album.attributes.artistName }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    
    <div v-if="error">
      Error: {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMusicKit } from '#imports'
import type { FetchMusicKitConfig, MusicKitAlbum } from '../src/types/musicKit'

const fetchMusicKitConfig:FetchMusicKitConfig = async () => {
  const config = await $fetch('/api/token')
  if (!config?.developerToken || !config?.app?.name || !config?.app?.build) {
    throw new Error('Invalid MusicKit configuration received from server')
  }
  return config
}

const { musicKitLoaded, musicKitConnected, tokenExpired, getInstance } = useMusicKit(fetchMusicKitConfig)

const loading = ref(true)
const error = ref<string>('')
const searchQuery = ref('')
const searchResults = ref<MusicKitAlbum[]>([])

const renewToken = async () => {
  try {
    await getInstance()
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : String(err)
  }
}

const searchAlbums = async () => {
  try {
    if (!searchQuery.value) {
      searchResults.value = []
      return
    }
    
    const musicKit = await getInstance()
    const storefrontId = musicKit.storefrontId
    if (!storefrontId) {
      throw new Error('No storefront ID available')
    }
    
    const response = await musicKit.api.music(`/v1/catalog/${storefrontId}/search`, {
      term: searchQuery.value,
      types: ['albums'],
      limit: 10
    })
    
    searchResults.value = response.data.results.albums?.data || []
  } catch (err: unknown) {
    console.error('Search Albums Error:', err)
    error.value = err instanceof Error ? err.message : String(err)
    searchResults.value = []
  }
}

watch(musicKitLoaded, async (loaded) => {
  if (loaded) {
    try {
      loading.value = false
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : String(err)
      loading.value = false
    }
  }
})
</script>

<style>
.album-list {
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  gap: 0.5rem;
}
.album-item {
  width: 200px;
  padding: 1rem;
  list-style: none;
  text-align: center;
}
.album-item img {
  width: 100%;
}
</style>

```

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

[license-src]: https://img.shields.io/npm/l/nuxt-musickit.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-musickit

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
