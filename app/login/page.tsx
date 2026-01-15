'use client'

import { Loader2, Presentation } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { FcGoogle } from 'react-icons/fc'

/**
 * LoginContent handles the actual interactive elements of the login page.
 * It is separated to allow for a Suspense boundary around useSearchParams.
 */
function LoginContent() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  // Standard Senior Practice: Fallback to /dashboard if no callbackUrl exists
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl })
    } catch (error) {
      console.error('Login failed:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8 bg-white shadow-xl rounded-2xl text-center max-w-sm w-full border border-gray-100">
      <div className="flex justify-center mb-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <Presentation className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">MeetingSnap</h1>
      <p className="text-gray-500 mb-8">Please sign in to access your dashboard.</p>

      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="cursor-pointer flex items-center justify-center gap-3 w-full px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        ) : (
          <FcGoogle className="w-6 h-6" />
        )}
        <span className="font-semibold text-gray-700">
          {isLoading ? 'Connecting...' : 'Continue with Google'}
        </span>
      </button>

      <p className="mt-6 text-xs text-gray-400">
        By signing in, you agree to our internal access policies.
      </p>
    </div>
  )
}

/**
 * LoginPage Component
 * Wrapped in Suspense to prevent hydration mismatches caused by searchParams.
 */
export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Suspense
        fallback={<div className="p-8 bg-white shadow-xl rounded-2xl animate-pulse w-80 h-96" />}
      >
        <LoginContent />
      </Suspense>
    </div>
  )
}
