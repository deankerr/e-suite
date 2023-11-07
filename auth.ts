import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import authConfig from './auth.config'
import { prisma } from './lib/prisma'

declare module 'next-auth' {
  interface User {
    role?: 'USER' | 'ADMIN'
  }

  interface Session {
    user: {
      id: string
      role: string
      name: string
      email?: string
      image?: string
    }
  }
}

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user, trigger, session, account, profile }) {
      if (user) {
        return {
          ...token,
          role: user.role,
        }
      }
      return token
    },
    async session({ session, token }) {
      return { ...session, user: { ...session.user, id: token.sub, role: token.role } }
    },
  },
})

/* 
  console.log('=== JWT ===')
        console.log('account', account)
        console.log('profile', profile)
        console.log('token', token)
        console.log('session', session)
        console.log('trigger', trigger)
        console.log('user', user)
*/
