import { NewAppError } from '@/lib/app-error'
import { getServerSession } from './auth'
import * as agents from './internal/agents.entity'
import * as model from './internal/model.entity'
import * as resource from './internal/resource.entity'

export const createUserDao = async () => {
  const session = await getServerSession()
  if (!session) throw new NewAppError('unauthenticated')

  const dao = {
    agents: {
      create: agents.createOwnedBy.bind(null, session.id),
      get: agents.getOwnedBy.bind(null, session.id),
      getAll: agents.getAllOwnedBy.bind(null, session.id),
      update: agents.updateOwnedBy.bind(null, session.id),
      delete: agents.deletedOwnedBy.bind(null, session.id),
    },
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
