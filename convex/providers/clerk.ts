import { WebhookEvent } from '@clerk/nextjs/server'
import { Webhook } from 'svix'
import { httpAction } from '../_generated/server'
import { assert } from '../util'

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
  const eventType = evt.type

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
  console.log('Webhook body:', body)

  return new Response('', { status: 200 })
})
