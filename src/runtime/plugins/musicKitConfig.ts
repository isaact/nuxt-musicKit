// plugins/musicKitConfig.ts
import { generateMusicKitConfig } from '../server/composables/useMusicKitConfig';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(async (nuxtApp) => {
  const musicKitConfig = await generateMusicKitConfig();
  nuxtApp.$config.public.musicKitConfig = musicKitConfig
});
