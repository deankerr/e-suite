import { WebhookEvent } from '@clerk/nextjs/server'
import { defineEnt } from 'convex-ents'
import { v } from 'convex/values'
import { Webhook } from 'svix'
import z from 'zod'
import { internal } from '../_generated/api'
import { Doc, Id } from '../_generated/dataModel'
import { httpAction, internalAction, internalMutation, internalQuery } from '../_generated/server'
import { assert } from '../util'

type ClerkEvent = 'user.created' | 'user.updated' | 'user.deleted'

const clerkWebhookEventsFields = {
  body: v.string(),
  id: v.string(),
  type: v.string(),
}

export const clerkWebhookEventsEnt = defineEnt(clerkWebhookEventsFields)

export const clerkWebhookHandler = httpAction(async (ctx, request) => {
  const clerkWebhookSecret = process.env.CLERK_WEBHOOK_SECRET
  assert(clerkWebhookSecret, 'CLERK_WEBHOOK_SECRET is undefined')

  const svix_id = request.headers.get('svix-id')
  const svix_timestamp = request.headers.get('svix-timestamp')
  const svix_signature = request.headers.get('svix-signature')
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  const payload = await request.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(clerkWebhookSecret)

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occurred', {
      status: 400,
    })
  }

  const { id } = evt.data
  const eventType = evt.type as ClerkEvent

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
  console.log('svix-id', svix_id)
  console.log('Webhook body:', body)

  const eventData = {
    type: eventType,
    id: id ?? svix_id,
    body,
  }

  const eventId = await ctx.runMutation(internal.providers.clerk.addEvent, eventData)
  await ctx.scheduler.runAfter(0, internal.providers.clerk.processUserEvent, { eventId })

  return new Response('', { status: 200 })
})

export const addEvent = internalMutation(
  async (ctx, args: { type: ClerkEvent; id: string; body: string }) =>
    await ctx.db.insert('clerkWebhookEvents', args),
)

export const get = internalQuery({
  args: {
    id: v.id('clerkWebhookEvents'),
  },
  handler: async (ctx, { id }) => await ctx.db.get(id),
})

export const processUserEvent = internalAction({
  args: {
    eventId: v.id('clerkWebhookEvents'),
  },
  handler: async (ctx, { eventId }) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const event = (await ctx.runQuery(internal.providers.clerk.get, {
      id: eventId,
    })) as Doc<'clerkWebhookEvents'> | null

    assert(event, 'Invalid event id')

    if (event.type === 'user.created') {
      const fields = parseUserFieldsFromEvent(event.body)
      await ctx.runMutation(internal.users.create, fields)
    }
    if (event.type === 'user.deleted') {
      await ctx.runMutation(internal.users.authDeleted, { token: getToken(event.id) })
    }
  },
})

const parseUserFieldsFromEvent = (body: string) => {
  const { data: payload } = clerkUserCreatedSchema.parse(JSON.parse(body))

  const tokenIdentifier = getToken(payload.id)

  const email = payload.email_addresses[0]
  assert(email, 'Unable to parse new user email')

  const username = generateUsername(payload)
  const avatar = payload.image_url

  return {
    tokenIdentifier,
    username,
    avatar,
    personal: {
      email: email.email_address,
      firstName: payload.first_name,
      lastName: payload.last_name,
    },
  }
}

const getToken = (id: string) => {
  const issuerDomain = process.env.CLERK_JWT_ISSUER_DOMAIN
  assert(issuerDomain, 'CLERK_JWT_ISSUER_DOMAIN is undefined')
  return `${issuerDomain}|${id}`
}

const generateUsername = (payload: z.infer<typeof clerkUserCreatedSchema>['data']) => {
  if (payload.username) return payload.username
  if (payload.first_name) {
    if (payload.last_name) return `${payload.first_name}.${payload.last_name.slice(0, 1)}`
    return payload.first_name
  }
  return `artist${Date.now().toString().slice(0, 4)}`
}

const clerkUserCreatedSchema = z.object({
  data: z.object({
    id: z.string().min(1),
    image_url: z.string().url(),
    email_addresses: z
      .array(
        z.object({
          email_address: z.string().email(),
        }),
      )
      .min(1),
    first_name: z
      .string()
      .nullable()
      .transform((v) => (v ? v : undefined)),
    last_name: z
      .string()
      .nullable()
      .transform((v) => (v ? v : undefined)),
    username: z
      .string()
      .nullable()
      .transform((v) => (v ? v : undefined)),
  }),
})
