import { defineEventHandler, createError } from 'h3'
import { useRuntimeConfig, generateDeveloperToken } from '#imports'

export default defineEventHandler(async (_) => {
  const config = useRuntimeConfig()

  try {
    // Ensure the keys exist in the config
    const { developerKey, teamID, keyID } = config.musicKit
    if (!developerKey || !teamID || !keyID) {
      throw new Error('Missing required musicKitLoader keys in runtime config.')
    }

    // Generate the token using your utility function
    const token = await generateDeveloperToken(developerKey, teamID, keyID)

    // Return the token as a response
    return { token }

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

