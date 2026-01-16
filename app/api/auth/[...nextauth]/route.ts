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
  },
  // Custom pages ensure users don't see the default NextAuth UI
  pages: {
    signIn: '/login', // custom login page
    error: '/auth/error', // Custom error page
  },
})

export { handler as GET, handler as POST }
