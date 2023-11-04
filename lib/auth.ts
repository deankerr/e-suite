import { prisma } from '@/lib/prisma'
import { env } from '@/lib/utils'
import { PrismaAdapter } from '@auth/prisma-adapter'
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'
import { DefaultSession, getServerSession, NextAuthOptions, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import DiscordProvider from 'next-auth/providers/discord'
import GithubProvider from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

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

declare module 'next-auth/jwt' {
  // Returned by the `jwt` callback and `auth`, when using JWT sessions
  interface JWT {
    uid: string
    role: string
  }
}

export const nextAuthConfig = {
  session: { strategy: 'jwt' },
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: env('GITHUB_ID'),
      clientSecret: env('GITHUB_SECRET'),
    }),
    DiscordProvider({
      clientId: env('DISCORD_ID'),
      clientSecret: env('DISCORD_SECRET'),
    }),
    Google({
      clientId: env('GOOGLE_ID'),
      clientSecret: env('GOOGLE_SECRET'),
    }),
  ],
  callbacks: {
    async jwt({ account, profile, token, session, trigger, user }) {
      if (user) {
        console.log('=== JWT ===')
        console.log('account', account)
        console.log('profile', profile)
        console.log('token', token)
        console.log('session', session)
        console.log('trigger', trigger)
        console.log('user', user)

        token.uid = user.id
        token.role = user.role ?? ''
      }

      return token
    },

    async session({ session, token }) {
      session.user.id = token.uid
      session.user.role = token.role

      return session
    },
  },
} satisfies NextAuthOptions

export function serverSession(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, nextAuthConfig)
}
