import { customType } from 'drizzle-orm/sqlite-core'

export const dateTimeStamp = customType<{
  data: Date
  driverData: string
  default: true
}>({
  dataType() {
    return 'datetime'
  },
  toDriver(value) {
    return value.toISOString()
  },
  fromDriver(value) {
    return new Date(value)
  },
})
