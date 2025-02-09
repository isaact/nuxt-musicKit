import { ref, onMounted, useRuntimeConfig, computed } from '#imports'
import { isTokenExpired, generateDeveloperToken } from '../server/utils/musicKit'

const devToken = ref('')
const musicKitConnected = ref(false)
const musicKitLoaded = ref(false)
// const error = ref(null)

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

export function useMusicKit() {
  const config = useRuntimeConfig()
  const musicKitOptions = config.public.musicKit as PublicMusicKitConfig
  devToken.value = musicKitOptions.MUSICKIT_TOKEN

  const tokenExpired = computed(() => {
    return isTokenExpired(devToken.value)
  })

  // async function fetchToken() {
  //   try {
  //     const response = await fetch(musicKitOptions.MUSICKIT_TOKEN_API_URL)
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`)
  //     }
  //     const data = await response.json()
  //     devToken.value = data.token
  //     console.log(devToken.value)
  //     return data.token
  //   } catch (err) {
  //     console.log(err)
  //     throw err
  //   }
  // }
  const initialize = async (dev_token:string) => {
    if(window.MusicKit && !musicKitConnected.value){
      devToken.value = dev_token;
      if(!tokenExpired){
        musicKitLoaded.value = true
        const mkConfig = {
          developerToken: devToken.value,
          app: {
            name: musicKitOptions.MUSICKIT_APP_NAME,
            build: musicKitOptions.MUSICKIT_APP_BUILD,
          },
        }
        await window.MusicKit.configure(mkConfig)
        const musicKit = window.MusicKit?.getInstance()
        if(musicKit){
          await testConnection(musicKit)
        }
      }
    }
  }
  const getInstance = async (): Promise<MusicKitInstance | undefined> => {
    if (window.MusicKit && musicKitLoaded.value && !isTokenExpired(devToken.value)) {  
      const instance = window.MusicKit.getInstance();
      return instance;
    }
  
    // If conditions aren't met, return undefined
    return undefined;
  };

  onMounted(async () => {
    if (window.MusicKit) {
      // musicKitLoaded.value = true
      // console.log('booo', window.MusicKit.initialized)
      await initialize()
    }else{
      // Listen for musickitloaded event
      window.addEventListener('musickitloaded', async () => {
        // musicKitLoaded.value = true
        await initialize();
      })
    }
  })

  return {
    devToken,
    musicKitLoaded,
    musicKitConnected,
    generateDeveloperToken,
    getInstance,
    tokenExpired
  }
}