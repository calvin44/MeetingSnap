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

type EnvVars = {
    [K in (typeof requiredVars)[number]]: string
}

// Function to validate environment variables
function validateEnv(): EnvVars {
    const missingVars: string[] = []
    const env: Partial<EnvVars> = {}

    for (const v of requiredVars) {
        const value = process.env[v]
        if (!value) {
            missingVars.push(v)
        } else {
            env[v] = value
        }
    }

    if (missingVars.length > 0) {
        throw new Error(
            `❌ Critical: Missing environment variables: ${missingVars.join(
                ', ',
            )}. Please check your .env.local file.`,
        )
    }

    return env as EnvVars
}

// Singleton export of validated environment variables
export const env = validateEnv()
