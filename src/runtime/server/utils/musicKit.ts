import { SignJWT, importPKCS8, decodeJwt } from 'jose'
import { createError } from 'h3'

export async function generateDeveloperToken(privateKey: string, teamId: string, keyId: string) {
    if (!privateKey || !teamId || !keyId) {
        throw createError({
            statusCode: 500,
            message: 'Missing required environment variables for Apple Music authentication'
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
        console.error(`Failed to generate developer token (keylen: ${privateKey.length}):`, error)
        throw error
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