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
  private reqId = createId()
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
    let serialized
    try {
      if (!data) serialized = 'NO DATA'
      else serialized = JSON.stringify(data)
    } catch (err) {
      console.error('RouteLogger failed to parse data payload')
      console.error(data)
      serialized = 'BAD DATA'
    }

    const logItem = {
      ...items,
      reqId: this.reqId,
      route: this.route,
      timestamp: new Date(),
      data: serialized,
    }

    logObjFormat(logItem, items.tag)
  }
}
