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
      
      <h2>Jazz Radio Stations</h2>
      <ul>
        <li v-for="station in stations" :key="station.id" @click="playStation(station)">
          {{ station.name }}
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
const { musicKitLoaded, musicKitConnected, tokenExpired, getInstance } = useMusicKit()
const _mk = getInstance()
const stations = ref([])
const loading = ref(true)
const error = ref(null)

const fetchStations = async () => {
  try {
    const musicKit = await getInstance()
    console.log('MusicKit instance:', musicKit)
    
    // Get storefront ID from MusicKit instance
    const storefrontId = musicKit.storefrontId
    if (!storefrontId) {
      throw new Error('No storefront ID available')
    }
    
    console.log('Using storefront ID:', storefrontId)
    
    const response = await musicKit.api.music(`/v1/test`, {
     'filter[featured]': 'apple-music-live-radio',
    })
    
    console.log('API Response:', response)
    
    // stations.value = response.data.map(station => ({
    //   id: station.id,
    //   name: station.attributes.name,
    //   url: station.attributes.playParams.id
    // })).slice(0, 5) // Get first 5 stations
  } catch (err) {
    console.error('Fetch Stations Error:', err)
    error.value = `Error: ${err.message} - ${err.response?.data?.errors?.[0]?.detail || 'No additional details'}`
  }
}

const playStation = async (station) => {
  try {
    const musicKit = await getInstance()
    await musicKit.playStream(station.url)
  } catch (err) {
    error.value = err.message
  }
}

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
      await fetchStations()
      loading.value = false
    } catch (err) {
      error.value = err.message
      loading.value = false
    }
  }
})
</script>

<style>
.connected {
  color: green;
}
</style>