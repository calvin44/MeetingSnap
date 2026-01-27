import { checkWhitelistedUser } from '@/lib/db'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { prompt: "select_account" } }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false

      // Use isolated DB logic
      const isAllowed = await checkWhitelistedUser(user.email)

      if (!isAllowed) {
        console.warn(`Blocked unauthorized login: ${user.email}`)
        return false
      }

      // Login successful!
      return true
    },
    async session({ session }) {
      if (!session.user?.email) return session

      // Check if the user is still whitelisted during the session check
      const isStillAllowed = await checkWhitelistedUser(session.user.email)

      if (!isStillAllowed) {
        console.warn(`Marking session as revoked for removed user: ${session.user.email}`)
        session.error = 'SessionRevoked'
        return session
      }

      return session
    },
  },
  // Custom pages ensure users don't see the default NextAuth UI
  pages: {
    signIn: '/login', // custom login page
    error: '/auth/error', // Custom error page
  },
})

export { handler as GET, handler as POST }
