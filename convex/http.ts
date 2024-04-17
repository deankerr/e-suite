import { httpRouter } from 'convex/server'

import { handleWebhook } from './providers/clerk'

const http = httpRouter()

http.route({
  path: '/clerk',
  method: 'POST',
  handler: handleWebhook,
})

export default http
