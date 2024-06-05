export type E_Thread = {
  _id: string
  _creationTime: number

  title?: string
  slug: string
  instructions?: string

  latestActivityTime: number
  userId: string
}
