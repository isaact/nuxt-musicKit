import { ref, onMounted } from '#imports'

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
    musicKitLoaded
  }
}