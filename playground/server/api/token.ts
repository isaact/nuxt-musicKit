import { defineEventHandler, createError } from 'h3'
import { generateMusicKitConfig, useRuntimeConfig } from "#imports"

export default defineEventHandler(async (_) => {
  try {
    // Get pre-validated config with fresh token
    const config = useRuntimeConfig()
    const musicKitConfig = await generateMusicKitConfig(config.musicKit)
    return musicKitConfig

  } catch (error: unknown) {
    // Type narrow the error before accessing properties
    let message: string

    if (error instanceof Error) {
      // Handle the case where it's an Error object
      message = error.message
    } else {
      // Handle the case where the error is something else
      message = 'An unknown error occurred during token generation.'
    }
    
    // Throw a new error with a meaningful message
    throw createError({
      statusCode: 500,
      statusMessage: message
    })
  }
})

