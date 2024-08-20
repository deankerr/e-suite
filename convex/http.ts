import { httpRouter } from 'convex/server'

import { serve } from './db/images'
import { serveMetadata } from './db/page'
import { handleWebhook } from './lib/clerk'

const http = httpRouter()

http.route({
  path: '/clerk',
  method: 'POST',
  handler: handleWebhook,
})

http.route({ pathPrefix: '/i/', method: 'GET', handler: serve })

http.route({
  path: '/page',
  method: 'GET',
  handler: serveMetadata,
})

export default http
