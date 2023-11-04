import type { NextAuthConfig } from 'next-auth'
import Discord from 'next-auth/providers/discord'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

export default {
  providers: [GitHub, Discord, Google],
} satisfies NextAuthConfig
