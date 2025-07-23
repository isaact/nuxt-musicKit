import { ref, onMounted, computed, useRuntimeConfig, watch } from '#imports'
import type { MusicKitConfig, MusicKitInstance, MusicKitPlaylist } from '#imports'
// import type { MusicKitInstance } from '~/src/types/musicKit'
import { isTokenExpired } from '../server/utils/musicKit'


const musicKitConnected = ref(false)
const musicKitLoaded = ref(false)
const initialized = ref(false)
const musicKitConfig = ref<MusicKitConfig | null>(null)

const testConnection = async (musicKit: MusicKitInstance) =>  {
  if(musicKit){
    const { response } = await musicKit.api.music('/v1/test')
    if(response.ok){
      musicKitConnected.value = true
      return true
    }
  }
  return false
}


export function useMusicKit() {
  const tokenExpired = computed(() => {
    if(musicKitConfig.value){
      return isTokenExpired(musicKitConfig.value?.developerToken)
    }
    return true;
  })

  const updateConfig = async () => {
    if(musicKitConfig.value && window.MusicKit){
      await window.MusicKit.configure(musicKitConfig.value)
      const musicKit = window.MusicKit?.getInstance()
      if(musicKit){
        await testConnection(musicKit)
      }
    }
  }

  const initialize = async () => {
    if(!initialized.value){
      initialized.value = true
      const config = useRuntimeConfig()
      musicKitConfig.value = config.public.musicKitConfig as MusicKitConfig
      if(musicKitLoaded.value && !musicKitConnected.value){
        await updateConfig()
      }
    }
  }

  const getInstance = async (): Promise<MusicKitInstance | undefined> => {
    if (window.MusicKit && musicKitLoaded.value) {  
      if(tokenExpired.value){
        await initialize();
      }
      const instance = window.MusicKit.getInstance();
      return instance;
    }
  
    // If conditions aren't met, return undefined
    return undefined;
  };

  onMounted(async () => {
    if (window.MusicKit) {
      musicKitLoaded.value = true
      if(!initialized.value){
        await initialize()
      }
    }else{
      // Listen for musickitloaded event
      window.addEventListener('musickitloaded', async () => {
        musicKitLoaded.value = true
        await initialize();
      })
    }
  })
  watch(musicKitConfig, async (newConfig) => {
    if (newConfig) {
      updateConfig()
    }
  })

  if(!initialized.value){
    initialize();
  }

  const fetchUserPlaylists = async (options?: { limit?: number; offset?: number }): Promise<MusicKitPlaylist[]> => {
    const musicKit = await getInstance()
    if (musicKit) {
      const params = new URLSearchParams()
      if (options?.limit) {
        params.append('limit', String(options.limit))
      }
      if (options?.offset) {
        params.append('offset', String(options.offset))
      }
      const queryString = params.toString()
      const url = `/v1/me/library/playlists${queryString ? `?${queryString}` : ''}`
      const { data } = await musicKit.api.music(url)
      return data.data as MusicKitPlaylist[]
    }
    return []
  }

  return {
    musicKitLoaded,
    musicKitConnected,
    musicKitConfig,
    getInstance,
    tokenExpired,
    fetchUserPlaylists,
  }
}