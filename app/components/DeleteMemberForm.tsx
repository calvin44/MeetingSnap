'use client'

import { ActionState, removeMember } from '@/app/dashboard/team/actions'
import { Loader2, Trash2 } from 'lucide-react'
import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'

interface DeleteMemberButtonProps {
  id: string
}

/**
 * A specialized delete button component that uses useActionState
 * and function binding for targeted record deletion.
 */
export function DeleteMemberButton({ id }: DeleteMemberButtonProps) {
  /**
   * Pre-fill the first argument of removeMember with the record ID.
   * Signature becomes: (prevState, formData)
   */
  const removeMemberWithId = removeMember.bind(null, id)

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    removeMemberWithId,
    null,
  )

  useEffect(() => {
    if (!state) return

    if (state.error) {
      toast.error('Operation Failed', {
        description: state.error,
      })
    }

    if (state.success) {
      toast.success('Member Removed', {
        description: 'The user has been successfully deleted from the whitelist.',
      })
    }
  }, [state])

  return (
    <form action={formAction} className="inline-block">
      <button
        type="submit"
        disabled={isPending}
        aria-label="Delete member"
        className="cursor-pointer p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center"
      >
        {isPending ? (
          <Loader2 size={18} className="animate-spin text-red-600" />
        ) : (
          <Trash2 size={18} />
        )}
      </button>
    </form>
  )
}
