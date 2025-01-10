import { defineNuxtPlugin, useHead } from '#app'

export default defineNuxtPlugin((_nuxtApp) => {
  // console.log('Plugin injected by my-module!')
  useHead({
    title: 'My Nuxt App',
    meta: [
      { name: 'apple-music-developer-token', content: 'blah blah' },
    ]
   })
})
