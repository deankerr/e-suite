import { JWT } from '@auth/core/jwt'
import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth, { DefaultSession } from 'next-auth'
import authConfig from './auth.config'
import { prisma } from './lib/prisma'

declare module 'next-auth' {
  // Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
  interface User {
    role?: string
  }

  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession['user']
  }
}

//? can't augment type?
declare module '@auth/core/jwt' {
  // Returned by the `jwt` callback and `auth`, when using JWT sessions
  interface JWT {
    uid: string
    role: string
    testAugmentIsWorking: boolean
  }
}

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string
        session.user.role = token.role as string
      }

      return session
    },
  },
  ...authConfig,
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
