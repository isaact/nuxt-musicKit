import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'

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
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.app.head.script ||= []
    // Extend Nuxt config to load the MusicKit.js library
    nuxt.options.app.head.script.push({
      src: 'https://js-cdn.music.apple.com/musickit/v3/musickit.js',
      defer: true,
      'data-web-components': true,
    });

    nuxt.options.app.head.meta ||= []
    nuxt.options.app.head.meta.push(
      { name: 'apple-music-app-name', content: options.appName },
      { name: 'apple-music-app-build', content: options.appBuild },
    )
    // nuxt.options.runtimeConfig.musicKit =defu(nuxt.options.runtimeConfig.musicKit, options)
    nuxt.options.runtimeConfig.musicKit ||= options

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))
  },
})
