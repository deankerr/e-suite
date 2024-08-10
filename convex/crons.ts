import { cronJobs } from 'convex/server'

import { internal } from './_generated/api'

const crons = cronJobs()

crons.hourly('import models', { minuteUTC: 19 }, internal.db.models.importEndpointModels)

export default crons
