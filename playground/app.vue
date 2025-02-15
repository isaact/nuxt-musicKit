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
                :alt="album.attributes.name"
                class="album-art"
              >
              <div class="album-details">
                <h3>{{ album.attributes.name }}</h3>
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
