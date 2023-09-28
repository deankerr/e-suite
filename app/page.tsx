'use client'

import { AppShell, Burger, Button, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Image from 'next/image'

export default function Home() {
  const [opened, { toggle }] = useDisclosure()

  return (
    <main>
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        padding="md"
      >
        <AppShell.Header>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title>kylie</Title>
        </AppShell.Header>

        <AppShell.Navbar p="md">Navbar</AppShell.Navbar>

        <AppShell.Main>
          Main
          <Button>kylie!</Button>
        </AppShell.Main>
      </AppShell>
    </main>
  )
}
