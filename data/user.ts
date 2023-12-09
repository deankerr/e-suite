import { NewAppError } from '@/lib/app-error'
import { getServerSession } from './auth'
import * as model from './internal/model.entity'
import * as resource from './internal/resource.entity'

export const createUserDAO = async () => {
  const session = await getServerSession()
  if (!session) throw new NewAppError('unauthenticated')

  const dao = {
    resources: {
      get: resource.get,
      getAll: resource.getAll,
    },
    models: {
      get: model.get,
      getAll: model.getAll,
    },
  }

  return dao
}
