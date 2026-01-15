'use client'

import { ActionState, addMember } from '@/app/dashboard/team/actions'
import { AlertCircle, UserPlus } from 'lucide-react'
import { useActionState } from 'react'

/**
 * Client Component for adding members with error feedback.
 */
export function AddMemberForm() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(addMember, null)

  return (
    <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">
        Authorize New Member
      </h2>
      <form action={formAction} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              name="email"
              type="email"
              required
              placeholder="name@iscoollab.com"
              disabled={isPending}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:bg-slate-400"
          >
            <UserPlus size={20} />
            {isPending ? 'Adding...' : 'Add to Team'}
          </button>
        </div>

        {state?.error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm font-medium border border-red-100 animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={16} />
            {state.error}
          </div>
        )}
      </form>
    </section>
  )
}
