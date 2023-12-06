import { createApiLog } from '@/data/logs'
import { createId } from '@paralleldrive/cuid2'
import { logObjFormat } from './utils'

type RouteLogPhase =
  | 'request-init'
  | 'request-body'
  | 'vendor-request'
  | 'vendor-response'
  | 'response-body'
  | 'error'

type RouteLogErrorCode = 'unknown' | 'unauthorized' | 'validation'

export class RouteContext {
  private requestId = createId()
  private route: string

  constructor(route: string) {
    this.route = route
  }

  log({
    data,
    ...items
  }: {
    tag: RouteLogPhase
    data: unknown
    authId?: string
    vendorId?: string
    errorCode?: RouteLogErrorCode
  }) {
    const logItem = {
      ...items,
      requestId: this.requestId,
      route: this.route,
      timestamp: new Date(),
      data: data ?? 'NO DATA',
    }

    createApiLog(logItem)
    logObjFormat(logItem, items.tag)
  }
}
