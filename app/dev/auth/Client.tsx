'use client'

import { useAuth, useUser } from '@clerk/nextjs'
import { Card, Heading } from '@radix-ui/themes'

type ClientProps = { props?: unknown }

export const Client = ({}: ClientProps) => {
  const auth = useAuth()
  const token = auth.getToken()

  const user = useUser()

  return (
    <>
      <Card>
        <Heading size="4">useAuth()</Heading>
        <pre className="m-2 overflow-auto border">{JSON.stringify(auth, null, 2)}</pre>
        <pre className="m-2 overflow-auto border">{JSON.stringify(token, null, 2)}</pre>
      </Card>

      <Card>
        <Heading size="4">useUser()</Heading>
        <pre className="m-2 overflow-auto border">{JSON.stringify(user, null, 2)}</pre>
      </Card>
    </>
  )
}
