import { httpRouter } from 'convex/server'

import { serveImage } from './images/manage'
import { handleWebhook } from './providers/clerk'

const http = httpRouter()

http.route({
  path: '/clerk',
  method: 'POST',
  handler: handleWebhook,
})

http.route({ pathPrefix: '/i/', method: 'GET', handler: serveImage })

export default http
