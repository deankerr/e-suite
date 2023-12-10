import 'server-only'
import { AppError } from '@/lib/error'
import { getServerSession } from './auth'
import * as model from './internal/model.entity'
import * as resource from './internal/resource.entity'

export const createAdminDao = async () => {
  const session = await getServerSession()
  if (!session) throw new AppError('unauthenticated')
  if (!session.isAdmin) throw new AppError('unauthorized')

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
