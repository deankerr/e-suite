import 'server-only'
import * as model from './internal/model.entity'
import * as resource from './internal/resource.entity'

export const serverDao = {
  resources: {
    get: resource.get,
    getAll: resource.getAll,
  },
  models: {
    get: model.get,
    getAll: model.getAll,
  },
}
