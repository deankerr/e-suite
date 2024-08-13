import { cronJobs } from 'convex/server'

import { internal } from './_generated/api'

const crons = cronJobs()

crons.daily('import models', { hourUTC: 1, minuteUTC: 19 }, internal.db.models.importEndpointModels)

export default crons
