<template>
  <div>
    <h1>Nuxt MusicKit Playground</h1>
    
    <div v-if="loading">
      Loading MusicKit...
    </div>
    
    <div v-if="!loading && musicKitLoaded">
      <div class="token-controls">
        <button @click="renewToken" :disabled="!tokenExpired">
          Renew Developer Token
        </button>
        <div :class="['token-status', { expired: tokenExpired }]">
          Token Status: {{ tokenExpired ? 'Expired' : 'Valid' }}
        </div>
      </div>
      
      <h2>Top 25 Songs</h2>
      <ul>
        <li v-for="song in songs" :key="song.id">
          {{ song.title }} - {{ song.artist }}
        </li>
      </ul>
    </div>
    
    <div v-if="error">
      Error: {{ error }}
    </div>
  </div>
</template>

<script setup>
import { useMusicKit } from '#imports'
const { musicKitLoaded, tokenExpired, getInstance } = useMusicKit()
const loading = ref(true)
const songs = ref([])
const error = ref(null)

const renewToken = async () => {
  try {
    await getInstance()
  } catch (err) {
    error.value = err.message
  }
}

watch(musicKitLoaded, async (loaded) => {
  if (loaded) {
    try {
      // const response = await window.MusicKit.getTopSongs(25)
      // songs.value = response.songs
      loading.value = false
    } catch (err) {
      error.value = err.message
      loading.value = false
    }
  }
})
</script>
