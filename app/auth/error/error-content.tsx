'use client'
import { ArrowLeft, ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-xl">
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-red-100 p-4">
          <ShieldAlert className="h-10 w-10 text-red-600" />
        </div>
      </div>

      <h1 className="mb-3 text-2xl font-bold text-gray-900">Access Denied</h1>

      <p className="mb-8 leading-relaxed text-gray-600">
        {error === 'AccessDenied'
          ? "You aren't on the authorized list for MeetingSnap. Please contact your administrator to gain access."
          : 'An unexpected authentication error occurred while trying to sign you in.'}
      </p>

      <Link
        href="/login"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 font-medium text-white transition-all hover:bg-gray-800 active:scale-[0.98]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Login
      </Link>
    </div>
  )
}
