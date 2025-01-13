import { ref, onMounted } from '#imports'
import { generateDeveloperToken, isTokenExpired } from '../server/utils/musicKit'

declare global {
  interface Window {
    MusicKit?: {
      // Basic MusicKit properties
      initialized: boolean
      version: string
    }
  }
}

export function useMusicKit() {
  const devToken = ref(null)
  const userToken = ref(null)
  const authorized = ref(false)
  const musicKitLoaded = ref(false)

  const checkMusicKit = () => {
    if (window.MusicKit) {
      musicKitLoaded.value = true
    }
  }

  onMounted(() => {
    // Initial check
    checkMusicKit()
    
    // Listen for musickitloaded event
    window.addEventListener('musickitloaded', () => {
      musicKitLoaded.value = true
    })
  })

  return {
    devToken,
    userToken,
    authorized,
    musicKitLoaded
  }
}