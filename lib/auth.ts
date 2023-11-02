import { prisma } from '@/lib/prisma'
import { env } from '@/lib/utils'
import { PrismaAdapter } from '@auth/prisma-adapter'
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'
import { getServerSession, type NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import GithubProvider from 'next-auth/providers/github'

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
  ],
} satisfies NextAuthOptions

export function serverSession(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, nextAuthConfig)
}
