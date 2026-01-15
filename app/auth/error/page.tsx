import { Suspense } from 'react'
import ErrorContent from './error-content'

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 px-4">
      <Suspense
        fallback={
          <div className="animate-pulse text-gray-400 font-medium text-lg">
            Verifying access details...
          </div>
        }
      >
        <ErrorContent />
      </Suspense>
    </main>
  )
}
