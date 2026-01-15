'use server'

import { addWhitelistedUser, getWhitelistedUserById, removeWhitelistedUser } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'

/**
 * Interface for the Action State.
 * Using a consistent structure helps the client component handle UI updates predictably.
 */
export type ActionState = {
  error?: string
  success?: boolean
} | null

/**
 * Adds a member to the whitelist.
 * @param _prevState Required by useActionState.
 * @param formData Contains the email field.
 */
export async function addMember(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await getServerSession()

  if (!session) {
    return { error: 'Unauthorized: You must be logged in.' }
  }

  const email = formData.get('email') as string

  if (!email || !email.includes('@iscoollab.com')) {
    return { error: 'Only @iscoollab.com members can be added.' }
  }

  try {
    const sanitizedEmail = email.toLowerCase().trim()
    await addWhitelistedUser(sanitizedEmail)
    revalidatePath('/dashboard/team')
    return { success: true }
  } catch (error) {
    return { error: 'Failed to add member to the database.' }
  }
}

/**
 * Removes a member from the whitelist.
 * @param id The bound user ID.
 * @param _prevState Required by useActionState.
 * @param _formData Automatically appended by React forms, even if not used.
 */
export async function removeMember(
  id: string,
  _prevState: ActionState,
  _formData: FormData, // Must be present to match React's internal dispatch
): Promise<ActionState> {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return { error: 'Unauthorized.' }
  }

  try {
    const targetMember = await getWhitelistedUserById(id)

    if (!targetMember) {
      return { error: 'Member not found in whitelist.' }
    }

    // Protection against self-deletion
    if (targetMember.email === session.user.email) {
      return { error: 'Security Policy: You cannot revoke your own access.' }
    }

    await removeWhitelistedUser(id)
    revalidatePath('/dashboard/team')

    return { success: true }
  } catch (error) {
    return { error: 'An unexpected database error occurred.' }
  }
}
