import { authenticateApiSession, UserSession } from '@/data/auth'
import { AppError } from '@/lib/error'
import { NextRequest } from 'next/server'
import z, { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { RouteContext } from './RouteContext'

export type ProtectedRoute<ZReq extends z.ZodTypeAny, ZRes extends z.ZodTypeAny> = (
  request: NextRequest,
  ctx: RouteContext,
) => Promise<Response>

export function createProtectedRoute<ZReq extends z.ZodTypeAny, ZRes extends z.ZodTypeAny>({
  inputSchema,
  handler,
  outputSchema,
}: {
  inputSchema: ZReq
  handler: (input: z.infer<ZReq>, ctx: RouteContext) => Promise<Response>
  outputSchema: ZRes
}): ProtectedRoute<ZReq, ZRes> {
  return async function protectedRoute(request) {
    const ctx = new RouteContext(request.nextUrl.pathname)
    try {
      const { geo, destination, ip, method, mode, nextUrl, referrer, url } = request

      const headers = {} as any
      for (const [k, v] of request.headers.entries()) headers[k] = v

      ctx.log({
        tag: 'request-init',
        data: {
          headers,
          geo,
          destination,
          ip,
          method,
          mode,
          referrer,
          url,
          nextUrl: {
            basePath: nextUrl.basePath,
            buildId: nextUrl.buildId,
            defaultLocale: nextUrl.defaultLocale,
            domainLocale: nextUrl.domainLocale,
            hash: nextUrl.hash,
            host: nextUrl.host,
            hostname: nextUrl.hostname,
            href: nextUrl.href,
            locale: nextUrl.locale,
            origin: nextUrl.origin,
            password: nextUrl.password,
            pathname: nextUrl.pathname,
            port: nextUrl.port,
            protocol: nextUrl.protocol,
            search: nextUrl.search,
            searchParams: nextUrl.searchParams,
            username: nextUrl.username,
          },
        },
      })

      const { authId } = await authenticateApiSession(request.headers)
      const json = await request.json()
      ctx.log({ tag: 'request-body', data: json, authId })

      const parsedInput = inputSchema.parse(json)
      return await handler(parsedInput, ctx)
    } catch (err) {
      console.error(err)
      if (err instanceof AppError) {
        if (err.code === 'unauthorized') {
          ctx.log({ tag: 'error', errorCode: 'unauthorized', data: err })
          return Response.json(err, { status: 401 })
        }
      }

      if (err instanceof ZodError) {
        ctx.log({ tag: 'error', errorCode: 'validation', data: err })
        const { message, details } = fromZodError(err)
        return Response.json(new AppError('invalid_client_request', message, details), {
          status: 400,
        })
      }

      ctx.log({ tag: 'error', errorCode: 'unknown', data: err })
      return Response.json(new AppError('internal', 'An unknown/unhandled error occurred.'), {
        status: 500,
      })
    }
  }
}
