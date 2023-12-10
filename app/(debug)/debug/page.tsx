import { createUserDao } from '@/data/user'

export default async function Page() {
  const userDao = await createUserDao()

  const res = await userDao.resources.getAll()
  const ag = await userDao.agents.getAll()

  return (
    <div>
      hello {res.length} {ag.length}
    </div>
  )
}
