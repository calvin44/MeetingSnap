import { logger } from './logger'

/**
 * Centralized environment variable management.
 * Validates that all required variables are present at startup.
 */

const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    'GOOGLE_PRIVATE_KEY',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'MASTER_DOC_ID',
    'SHARED_DRIVE_ID',
] as const

const optionalVars = [
    'SMTP_USER',
    'SMTP_PASSWORD',
    'EMAIL_FROM_ADDRESS',
] as const

type EnvVars = {
    [K in (typeof requiredVars)[number]]: string
} & {
    [K in (typeof optionalVars)[number]]?: string
}

function validateEnv(): EnvVars {
    const missingVars: string[] = []
    const env: Partial<EnvVars> = {}

    // Check required
    for (const v of requiredVars) {
        const value = process.env[v]
        if (!value) {
            missingVars.push(v)
        } else {
            env[v] = value
        }
    }

    // Check optional
    for (const v of optionalVars) {
        env[v] = process.env[v]
    }

    if (missingVars.length > 0) {
        logger.error({ missingVars }, 'Missing Required Environment Variables')

        // During build, we might want to allow this if it's just a type check,
        // but for a real Next.js build, we usually want to fail. 
        // However, to unblock development, we'll throw a clear error.
        throw new Error(`Missing required env vars: ${missingVars.join(', ')}`)
    }

    return env as EnvVars
}

// Singleton export
export const env = validateEnv()
