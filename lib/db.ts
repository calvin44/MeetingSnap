import { supabase } from '@/lib/supabase'

/**
 * Interface representing the structure of a whitelisted user in the database.
 */
export interface WhitelistedUser {
  id: string
  email: string
  created_at: string
}

/**
 * Fetches all whitelisted users from Supabase.
 * @returns {Promise<WhitelistedUser[]>}
 */
export const getWhitelistedUsers = async (): Promise<WhitelistedUser[]> => {
  const { data, error } = await supabase
    .from('whitelisted_users')
    .select('*')
    .order('email', { ascending: true })

  if (error) {
    console.error('Fetch Error:', error.message)
    throw new Error('Failed to fetch team members')
  }

  return data || []
}

/**
 * Fetches a single whitelisted user by their UUID.
 * Required for server-side verification before deletion.
 * @param {string} id - The UUID of the record.
 * @returns {Promise<WhitelistedUser | null>}
 */
export const getWhitelistedUserById = async (id: string): Promise<WhitelistedUser | null> => {
  const { data, error } = await supabase.from('whitelisted_users').select('*').eq('id', id).single()

  if (error) {
    console.warn(`User with ID ${id} not found:`, error.message)
    return null
  }

  return data
}

/**
 * Adds a new email to the whitelist.
 * Uses 'upsert' behavior logic to handle potential duplicates gracefully.
 * @param {string} email - The email address to whitelist.
 */
export const addWhitelistedUser = async (email: string): Promise<void> => {
  const { error } = await supabase
    .from('whitelisted_users')
    .insert([{ email: email.toLowerCase().trim() }])

  // Error code '23505' is a unique constraint violation in Postgres
  if (error && error.code !== '23505') {
    throw new Error(error.message)
  }
}

/**
 * Removes a user from the whitelist.
 * @param {string} id - The UUID of the record to delete.
 */
export const removeWhitelistedUser = async (id: string): Promise<void> => {
  const { error } = await supabase.from('whitelisted_users').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Checks if an email exists in the whitelist.
 * Optimized for the Auth check (boolean return).
 * @param {string} email - The email to check.
 * @returns {Promise<boolean>}
 */
export const checkWhitelistedUser = async (email: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('whitelisted_users')
    .select('email')
    .eq('email', email)
    .single()

  if (error || !data) {
    return false
  }

  return true
}

