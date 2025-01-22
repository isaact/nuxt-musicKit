import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('MusicKit Module', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
    // env: {
    //   MUSIC_KIT_DEVELOPER_KEY: "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgHf0OGUU1tMUbIEk7\nJwrK9JZWohHtOiX6XjaGpYWELmGgCgYIKoZIzj0DAQehRANCAATDdHEJpymreX2W\nZU3cLTinB2t4X9o0ZfJr2Aohrs82zbboW6qBnAqiomHbXozPAxvwi1YwXzALzH28\nYcGkJxnh\n-----END PRIVATE KEY-----",
    //   MUSIC_KIT_TEAM_ID: "your team id",
    //   MUSIC_KIT_KEY_ID: "key id",
    //   MUSIC_KIT_APP_NAME: "app name",
    //   MUSIC_KIT_APP_BUILD: "app build"
    // },
    setupTimeout: 60000,
    server: true,
    build: true,
  })

  it('renders the index page', async () => {
    const html = await $fetch('/')
    expect(html).toContain('<div>basic</div>')
  })

  describe('API Endpoints', () => {
    it('returns valid token from /api/musicKit-token', async () => {
      const response = await $fetch<{ token: string }>('/api/musicKit-token')
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
})
