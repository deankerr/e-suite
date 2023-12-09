import { NewAppError } from '@/lib/app-error'
import { getServerSession } from './auth'
import * as model from './internal/model.entity'
import * as resource from './internal/resource.entity'

export const createAdminDAO = async () => {
  const session = await getServerSession()
  if (!session) throw new NewAppError('unauthenticated')
  if (!session.isAdmin) throw new NewAppError('unauthorized')

  const dao = {
    resources: {
      create: resource.create,
      update: resource.update,
      get: resource.get,
      getAll: resource.getAll,
    },
    models: {
      create: model.create,
      update: model.update,
      get: model.get,
      getAll: model.getAll,
    },
  }

  return dao
}
