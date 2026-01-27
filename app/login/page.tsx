'use client'

import { Loader2, Sparkles, AlertCircle } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState, useEffect } from 'react'
import { FcGoogle } from 'react-icons/fc'

/**
 * LoginContent handles the actual interactive elements of the login page.
 * It is separated to allow for a Suspense boundary around useSearchParams.
 */
function LoginContent() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const error = searchParams.get('error')

  // Senior Practice: Reset loading if we returned to this page with an error
  // OR if we returned via the browser back button (BFCache)
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setIsLoading(false)
      }
    }

    if (error) {
      setIsLoading(false)
    }

    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [error])

  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      // We let NextAuth handle the redirect. 
      // If it fails immediately, we catch it and reset.
      await signIn('google', { callbackUrl })
    } catch (err) {
      console.error('Login failed:', err)
      setIsLoading(false)
    }
  }

  return (
    <div className="relative group">
      {/* Premium Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

      <div className="relative p-12 bg-white/80 backdrop-blur-xl shadow-2xl rounded-[2.5rem] text-center max-w-md w-full border border-white/50 flex flex-col items-center">
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-2xl shadow-lg shadow-blue-500/30">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">MeetingSnap</h1>
        <p className="text-slate-500 mb-10 font-medium">Internal access for high-performance teams.</p>

        {error && (
          <div className="w-full mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in zoom-in-95 duration-300">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-xs font-bold uppercase tracking-wider text-left leading-relaxed">
              {error === 'SessionRevoked'
                ? 'Your access has been revoked by an administrator'
                : error === 'AccessDenied'
                  ? 'Whitelisted users only'
                  : 'Authentication failed'}
            </p>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="cursor-pointer flex items-center justify-center gap-4 w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl hover:bg-slate-800 transition-all duration-300 active:scale-95 shadow-xl shadow-slate-900/10 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          ) : (
            <div className="bg-white p-1 rounded-lg">
              <FcGoogle className="w-6 h-6" />
            </div>
          )}
          <span className="font-bold text-white tracking-tight">
            {isLoading ? 'Connecting...' : 'Continue with Google'}
          </span>
        </button>

        <div className="mt-10 pt-8 border-t border-slate-100 w-full">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Secure Infrastructure
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * LoginPage Component
 * Wrapped in Suspense to prevent hydration mismatches caused by searchParams.
 */
export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white bg-grid relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>

      <Suspense
        fallback={
          <div className="p-12 bg-white shadow-2xl rounded-[2.5rem] animate-pulse w-96 h-[400px] border border-slate-100" />
        }
      >
        <LoginContent />
      </Suspense>
    </div>
  )
}
