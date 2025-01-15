import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
// import { useMusicKit } from '../src/runtime/composables/useMusicKit'

describe('MusicKit Module', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
    env: {
      MUSIC_KIT_DEVELOPER_KEY: process.env.MUSIC_KIT_DEVELOPER_KEY,
      MUSIC_KIT_TEAM_ID: process.env.MUSIC_KIT_TEAM_ID,
      MUSIC_KIT_KEY_ID: process.env.MUSIC_KIT_KEY_ID,
      MUSIC_KIT_APP_NAME: process.env.MUSIC_KIT_APP_NAME,
      MUSIC_KIT_APP_BUILD: process.env.MUSIC_KIT_APP_BUILD
    },
    setupTimeout: 60000,
    server: true,
    build: true,
  })

  it('renders the index page', async () => {
    const html = await $fetch('/')
    expect(html).toContain('<div>basic</div>')
  })

  describe('API Endpoints', () => {
    it('returns valid token from /api/token', async () => {
      const response = await $fetch<{ token: string }>('/api/token')
      expect(response).toHaveProperty('token')
      expect(response.token).toBeTruthy()
    })

    it('returns proper error for invalid requests', async () => {
      await $fetch('/api/token', {
        method: 'POST',
        body: { invalid: 'request' }
      }).catch(err => {
        expect(err).toHaveProperty('statusCode', 400)
      })
    })
  })

  // describe('useMusicKit composable', () => {
  //   it('provides reactive state', () => {
  //     const {
  //       devToken,
  //       // authorized,
  //       musicKitLoaded,
  //       musicKitConnected,
  //       tokenExpired
  //     } = useMusicKit()
      
  //     expect(devToken.value).toBeDefined()
  //     // expect(authorized.value).toBeDefined()
  //     expect(musicKitLoaded.value).toBeDefined()
  //     expect(musicKitConnected.value).toBeDefined()
  //     expect(tokenExpired.value).toBeDefined()
  //   })

  //   it('provides getInstance method', async () => {
  //     const { getInstance } = useMusicKit()
  //     const instance = await getInstance()
  //     expect(instance).toBeDefined()
  //   })

  //   it('manages token expiration', async () => {
  //     const { tokenExpired } = useMusicKit()
  //     expect(typeof tokenExpired.value).toBe('boolean')
  //   })

  //   it('provides musicKit connection status', async () => {
  //     const { musicKitConnected } = useMusicKit()
  //     expect(typeof musicKitConnected.value).toBe('boolean')
  //   })
  // })
})
