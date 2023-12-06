import { authenticateApiRequest, AuthorizedApiSession } from '@/data/auth'
import { addApiLog } from '@/data/logs'
import { createId } from '@paralleldrive/cuid2'
import { NextRequest } from 'next/server'
import z, { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { NewAppError } from './app-error'

type PluginValidator = (input: any) => object | Error

type PluginModeRoute = {
  mode: 'chat' | 'moderation' | 'image'
  handler: (input: any) => any
  validate: {
    input: PluginValidator
    output: PluginValidator
  }
}

type RouteAccessLevel = 'public' | 'authorized' | 'admin'

export type RouteContext = {
  input: unknown
  session: AuthorizedApiSession
  log: ReturnType<typeof createRouteLogger>
}

export function route<ZInput extends z.ZodTypeAny>(config: {
  access: RouteAccessLevel
  input: ZInput
  handler: (routeData: {
    input: z.infer<ZInput>
    session: AuthorizedApiSession
    log: ReturnType<typeof createRouteLogger>
  }) => Promise<Response>
}): (request: NextRequest) => Promise<Response> {
  return async (request) => {
    const log = createRouteLogger(request)
    try {
      const auth = await authenticateApiRequest(request.headers)
      if (!auth.isAuthenticated) throw new NewAppError('unauthorized')
      log.add('authId', auth.session.id)
      log.add('session', auth.session)

      const requestJson = await request.json()
      log.add('requestBody', requestJson)
      log.send()
      const body = config.input.describe('route input validation').parse(requestJson)
      console.log('start handler')
      return await config.handler({ input: body, session: auth, log })
    } catch (err) {
      console.error(err)

      if (err instanceof NewAppError) {
        log.add('errorCode', err.code)
        return Response.json(err, { status: err.httpStatusCode })
      }

      if (err instanceof ZodError) {
        const zodError = fromZodError(err)
        console.log('fromzod')
        console.error(zodError)
        const validationError = new NewAppError('validation_client_request', { cause: zodError })
        log.add('errorCode', validationError.code)
        return Response.json(validationError, { status: validationError.httpStatusCode })
      }

      const unknownError = new NewAppError('unknown', { cause: err })
      log.add('errorCode', unknownError.code)
      return Response.json(unknownError, { status: unknownError.httpStatusCode })
    } finally {
      log.send()
    }
  }
}

function createRouteLogger(request: NextRequest) {
  const requestId = createId()
  const logData = new Map<string, unknown>()

  const headers = getHeaders(request)
  const nextUrl = getNextUrl(request)

  logData.set('host', headers?.host)
  logData.set('path', nextUrl?.pathname)
  logData.set('headers', headers)
  logData.set('nextUrl', nextUrl)
  logData.set('geo', request.geo)
  logData.set('destination', request.destination)
  logData.set('ip', request.ip)
  logData.set('method', request.method)
  logData.set('referrer', request.referrer)
  logData.set('url', request.url)

  const send = () => {
    const payload = Object.fromEntries(logData.entries()) as Record<string, string | undefined>
    logData.clear()
    addApiLog({ requestId, payload })
  }

  const add = (key: string, value: unknown) => logData.set(key, value)

  return { add, send }
}

function getHeaders(request: NextRequest) {
  const headers = {} as any
  for (const [key, value] of request.headers.entries()) {
    if (key === 'cookies') continue
    headers[key] = value
  }

  return headers
}

function getNextUrl(request: NextRequest) {
  const nextUrl = {
    basePath: request.nextUrl.basePath,
    buildId: request.nextUrl.buildId,
    defaultLocale: request.nextUrl.defaultLocale,
    domainLocale: request.nextUrl.domainLocale,
    hash: request.nextUrl.hash,
    host: request.nextUrl.host,
    hostname: request.nextUrl.hostname,
    href: request.nextUrl.href,
    locale: request.nextUrl.locale,
    origin: request.nextUrl.origin,
    password: request.nextUrl.password,
    pathname: request.nextUrl.pathname,
    port: request.nextUrl.port,
    protocol: request.nextUrl.protocol,
    search: request.nextUrl.search,
    searchParams: request.nextUrl.searchParams,
    username: request.nextUrl.username,
  }
  return nextUrl
}
