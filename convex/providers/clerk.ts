import { ConvexError } from 'convex/values'
import { Webhook } from 'svix'

import { internal } from '../_generated/api'
import { httpAction } from '../_generated/server'
import { getEnv } from '../util'

import type { WebhookEvent } from '@clerk/nextjs/server'

export const handleWebhook = httpAction(async (ctx, request) => {
  const webhookSecret = getEnv('CLERK_WEBHOOK_SECRET')
  const issuerDomain = getEnv('CLERK_JWT_ISSUER_DOMAIN')

  try {
    const svix_id = request.headers.get('svix-id') ?? ''
    const svix_timestamp = request.headers.get('svix-timestamp') ?? ''
    const svix_signature = request.headers.get('svix-signature') ?? ''

    const payload = await request.text()
    const wh = new Webhook(webhookSecret)

    const event = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent

    switch (event.type) {
      case 'user.created':
        await ctx.runMutation(internal.users.create, {
          fields: {
            tokenIdentifier: `${issuerDomain}|${event.data.id}`,
            name: event.data.username ?? event.data.first_name,
            imageUrl: event.data.image_url,
            role: 'user',
          },
        })
        break
      case 'user.updated':
        await ctx.runMutation(internal.users.update, {
          by: {
            tokenIdentifier: `${issuerDomain}|${event.data.id}`,
          },
          fields: {
            name: event.data.username ?? event.data.first_name,
            imageUrl: event.data.image_url,
            role: 'user',
          },
        })
        break
      case 'user.deleted':
        await ctx.runMutation(internal.users.remove, {
          by: {
            tokenIdentifier: `${issuerDomain}|${event.data.id}`,
          },
        })
        break
      default:
        throw new ConvexError({ message: 'Unhandled result type', type: event.type })
    }

    return new Response('OK', { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response('Error', {
      status: 400,
    })
  }
})
