import { httpRouter } from 'convex/server'

import { serveOptimizedImage } from './images'
import { handleWebhook } from './lib/clerk'

const http = httpRouter()

http.route({
  path: '/clerk',
  method: 'POST',
  handler: handleWebhook,
})

http.route({ pathPrefix: '/i/', method: 'GET', handler: serveOptimizedImage })

export default http
