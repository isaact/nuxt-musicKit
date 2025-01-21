import { SignJWT, importPKCS8, decodeJwt } from 'jose'
import { createError } from 'h3'

export async function generateDeveloperToken(privateKey: string, teamId: string, keyId: string) {
    if (!privateKey || !teamId || !keyId) {
        throw createError({
            statusCode: 500,
            message: 'Missing required environment variables for Apple Music authentication'
        })
    }

    // Strip out the headers and all whitespace characters from the private key
    privateKey = privateKey.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s+/g, '')
    privateKey = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`

    // Validate private key format
    if (!privateKey.startsWith('-----BEGIN PRIVATE KEY-----') || 
        !privateKey.includes('-----END PRIVATE KEY-----')) {
        throw createError({
            statusCode: 500,
            message: 'Invalid private key format. Ensure it includes proper PEM headers/footers'
        })
    }

    try {
        const ecPrivateKey = await importPKCS8(privateKey, 'ES256')
        const now = Math.floor(Date.now() / 1000)
        
        const token = await new SignJWT({
            iss: teamId,
            iat: now,
            exp: now + (24 * 60 * 60) // 24 hours
        })
            .setProtectedHeader({ alg: 'ES256', kid: keyId })
            .sign(ecPrivateKey)

        return token
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        const errorStack = error instanceof Error ? error.stack : undefined
        throw createError({
            statusCode: 500,
            message: `Failed to generate developer token: ${errorMessage}`,
            stack: errorStack
        })
    }
}

// Function to check if a JWT token has expired
export function isTokenExpired(token: string): boolean {
    try {
        const decoded = decodeJwt(token)
        const now = Math.floor(Date.now() / 1000)

        // Check if the token has an expiration time and compare it with the current time
        if (decoded.exp && decoded.exp < now) {
            return true // Token has expired
        }

        return false // Token is still valid
    } catch (error) {
        console.error('Failed to decode JWT token:', error)
        return true // If decoding fails, assume token is invalid/expired
    }
}