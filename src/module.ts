import { defineNuxtModule, addPlugin, createResolver, installModule } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {
  developerKey: string
  teamID: string
  keyID: string
  appName: string
  appBuild: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'my-module',
    configKey: 'musicKit',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    await installModule('@nuxt/scripts');

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))
  },
})
