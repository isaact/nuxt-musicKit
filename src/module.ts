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
  async setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)

    await installModule('@nuxt/scripts');

    nuxt.options.app.head.script ||= []
    // Extend Nuxt config to load the MusicKit.js library
    nuxt.options.app.head.script.push({
      src: 'https://js-cdn.music.apple.com/musickit/v3/musickit.js',
      defer: true,
      'data-web-components': true,
    });

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))
  },
})
