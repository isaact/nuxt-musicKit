import { ref, onMounted, computed } from '#imports'
// import { isTokenExpired } from '../utils/musicKit'
import { isTokenExpired } from '../server/utils/musicKit'

// const devToken = ref('')
const musicKitConnected = ref(false)
const musicKitLoaded = ref(false)
const updateToken = ref<FetchMusicKitConfig | null>(null)
const musicKitConfig = ref<MusicKitConfig | null>(null)

const testConnection = async (musicKit: MusicKitInstance) =>  {
  if(musicKit){
    console.log(musicKit)
    const { response } = await musicKit.api.music('/v1/test')
    console.log([response, response.ok, response.status])
    if(response.ok){
      musicKitConnected.value = true
      return true
    }
  }
  return false
}


export function useMusicKit(updateTokenHandler: FetchMusicKitConfig) {
  // const config = useRuntimeConfig()
  updateToken.value = updateTokenHandler
  // const musicKitOptions = config.public.musicKit as PublicMusicKitConfig
  // devToken.value = musicKitOptions.MUSICKIT_TOKEN

  const tokenExpired = computed(() => {
    if(musicKitConfig.value){
      return isTokenExpired(musicKitConfig.value?.developerToken)
    }
    return true;
  })

  const initialize = async () => {
    if(window.MusicKit && !musicKitConnected.value){
      if(tokenExpired && updateToken.value){
        musicKitConfig.value = await updateToken.value();
        await window.MusicKit.configure(musicKitConfig.value)
      }
      const musicKit = window.MusicKit?.getInstance()
      if(musicKit){
        await testConnection(musicKit)
      }
    }
  }
  const getInstance = async (): Promise<MusicKitInstance | undefined> => {
    if (window.MusicKit && musicKitLoaded.value) {  
      if(tokenExpired){
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
      await initialize()
    }else{
      // Listen for musickitloaded event
      window.addEventListener('musickitloaded', async () => {
        musicKitLoaded.value = true
        await initialize();
      })
    }
  })

  return {
    musicKitLoaded,
    musicKitConnected,
    getInstance,
    tokenExpired
  }
}