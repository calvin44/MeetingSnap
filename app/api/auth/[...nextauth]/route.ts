import { supabase } from '@/lib/supabase'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false

      // QUERY SUPABASE: Look for the email in your whitelist table
      const { data, error } = await supabase
        .from('whitelisted_users')
        .select('email')
        .eq('email', user.email)
        .single()

      // If there's an error or no data, the user is NOT on the list
      if (error || !data) {
        console.warn(`Blocked unauthorized login: ${user.email}`)
        return false
      }

      // Login successful!
      return true
    },
  },
  // Custom pages ensure users don't see the default NextAuth UI
  pages: {
    signIn: '/login', // custom login page
    error: '/auth/error', // Custom error page
  },
})

export { handler as GET, handler as POST }
