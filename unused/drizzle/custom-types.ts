import { customType } from 'drizzle-orm/sqlite-core'

export const dateTimeStamp = customType<{
  data: Date
  driverData: string
  default: false
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

export const date = customType<{
  data: Date
  driverData: string
  default: true
}>({
  dataType() {
    return 'date'
  },
  toDriver(value) {
    return value.toISOString()
  },
  fromDriver(value) {
    return new Date(value)
  },
})
