import { prisma } from '@/lib/db'
import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      //@ts-expect-error
      clientId: process.env.GITHUB_ID,
      //@ts-expect-error
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
})

export { handler as GET, handler as POST }
