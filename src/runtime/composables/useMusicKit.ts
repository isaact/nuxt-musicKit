import { ref, onMounted, useRuntimeConfig, computed } from '#imports'
import { isTokenExpired } from '../server/utils/musicKit'

declare global {
  interface Window {
    MusicKit?: {
      // Basic MusicKit properties
      initialized: boolean
      version: string
      configure: (config: {
        developerToken: string
        app: {
          name: string
          build: string
        }
      }) => Promise<void>
      getInstance: () => unknown
    }
  }
}

const devToken = ref('')
// const userToken = ref(null)
const authorized = ref(false)
const musicKitLoaded = ref(false)
// const error = ref(null)

const fetchToken = async () => {
  try {
    const response = await fetch('/api/token')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    devToken.value = data.token
    console.log(devToken.value)
    return data.token
  } catch (err) {
    console.log(err)
    throw err
  }
}

export function useMusicKit() {
  const config = useRuntimeConfig()
  const musicKitOptions = config.public.musicKit as PublicMusicKitConfig
  devToken.value = musicKitOptions.MUSICKIT_TOKEN
  // if(isTokenExpired(musicKitOptions.MUSICKIT_TOKEN)){
  //   await fetchToken();
  // }
  console.log(musicKitOptions)

  const tokenExpired = computed(() => {
    return isTokenExpired(devToken.value)
  })

  const getInstance = async () => {
    if(window.MusicKit){
      if(isTokenExpired(devToken.value)) {
        await fetchToken();
      }
      await window.MusicKit.configure({
        developerToken: devToken.value,
        app: {
          name: musicKitOptions.MUSICKIT_APP_NAME,
          build: musicKitOptions.MUSICKIT_APP_BUILD,
        },
      })
      return window.MusicKit.getInstance()
    }
  }

  onMounted(() => {
    if (window.MusicKit) {
      musicKitLoaded.value = true
    }else{
      // Listen for musickitloaded event
      window.addEventListener('musickitloaded', () => {
        musicKitLoaded.value = true
      })
    }
  })

  return {
    devToken,
    authorized,
    musicKitLoaded,
    getInstance,
    tokenExpired
  }
}