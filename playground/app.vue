<template>
  <div>
    <h1>Nuxt MusicKit Playground</h1>
    
    <div v-if="loading">
      Loading MusicKit...
    </div>
    
    <div v-if="!loading && musicKitLoaded">
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
// import {useMusicKit}
const { musicKitLoaded } = useMusicKit()
const loading = ref(true)
const songs = ref([])
const error = ref(null)

watch(musicKitLoaded, async (loaded) => {
  if (loaded) {
    try {
      const response = await window.MusicKit.getTopSongs(25)
      songs.value = response.songs
      loading.value = false
    } catch (err) {
      error.value = err.message
      loading.value = false
    }
  }
})
</script>
