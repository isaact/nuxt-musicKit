import { ref, computed, useRuntimeConfig, watch } from '#imports'
import type { MusicKitConfig } from '#imports'
// import type { MusicKitInstance } from '~/src/types/musicKit'
import { isTokenExpired } from '../server/utils/musicKit'


const musicKitConnected = ref(false)
const musicKitLoaded = ref(false)
const initialized = ref(false)
const musicKitConfig = ref<MusicKitConfig | null>(null)

const testConnection = async (musicKit: MusicKit.MusicKitInstance) =>  {
  if (musicKit) {
    try {
      await musicKit.api.music('/v1/test');
      musicKitConnected.value = true;
      return true;
    } catch (e) {
      console.error('MusicKit connection test failed:', e);
      musicKitConnected.value = false;
      // return false;
    }
  }
  return false;
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

  const getInstance = async (): Promise<MusicKit.MusicKitInstance | undefined> => {
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

  if (typeof window !== 'undefined') {
    if (window.MusicKit) {
      musicKitLoaded.value = true
      if (!initialized.value) {
        initialize()
      }
    } else {
      window.addEventListener('musickitloaded', async () => {
        musicKitLoaded.value = true
        await initialize()
      })
    }
  }
  watch(musicKitConfig, async (newConfig) => {
    if (newConfig) {
      updateConfig()
    }
  })

  if(!initialized.value){
    initialize();
  }

  const fetchUserPlaylists = async (options?: { limit?: number; offset?: number }): Promise<MusicKit.Playlists[]> => {
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
      const response = await musicKit.api.music(url) as { data: MusicKit.Playlists[] };
      return response.data;
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