import { auth, currentUser } from '@clerk/nextjs/server'
import { Card, Heading } from '@radix-ui/themes'

import { Client } from './Client'

export default async function Page() {
  const sauth = auth()
  const token = await sauth.getToken()

  const cuser = await currentUser()

  return (
    <div className="gap-2 space-y-4 p-4">
      <Card>
        <Heading size="4">auth()</Heading>
        <pre className="m-2 overflow-auto border">{JSON.stringify(sauth, null, 2)}</pre>

        <pre className="m-2 overflow-auto border">{JSON.stringify(token, null, 2)}</pre>
      </Card>

      <Card>
        <Heading size="4">currentUser()</Heading>
        <pre className="m-2 overflow-auto border">{JSON.stringify(cuser, null, 2)}</pre>
      </Card>

      <Client />
    </div>
  )
}
