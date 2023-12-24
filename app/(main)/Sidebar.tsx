'use client'

import { navConfig } from '@/config/nav'
import { cn } from '@/lib/utils'
import { Box, Flex, Heading, Separator, Text } from '@radix-ui/themes'
import logo from '/assets/icons/logo-sunset.svg'
import type { LucideIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

export const Sidebar = () => {
  const segment = useSelectedLayoutSegment()

  return (
    <Box className="w-64 flex-none border-r border-gray-5">
      {/* Logo */}
      <Flex justify="start" align="center" px="4" py="4" mr="4" gap="2" asChild>
        <Link href="/">
          <Image src={logo} alt="e/suite logo" className="-mb-0.5 -mr-0.5 size-9" priority />
          <Heading size="7" as="h1">
            e/suite
          </Heading>
        </Link>
      </Flex>

      {/* Nav */}
      <Flex direction="column" gap="1" px="2">
        {navConfig.map((navGroup) => (
          <>
            <Separator my="2" size="4" />
            {navGroup.map((n, i) => (
              <NavLink
                key={`${n.href}-${n.label}-${i}`}
                href={n.href}
                icon={n.icon}
                label={n.label}
                isActive={'/' + (segment ?? '') === n.href}
              />
            ))}
          </>
        ))}
      </Flex>
    </Box>
  )
}

type NavLinkProps = {
  href: string
  icon: LucideIcon
  label: string
  isActive: boolean
}

const NavLink = ({ href, icon: Icon, label, isActive }: NavLinkProps) => {
  return (
    <Link href={href}>
      <Flex
        gap="3"
        px="3"
        py="2"
        align="center"
        className={cn('rounded transition-colors', isActive ? 'bg-panel-solid' : 'hover:bg-gray-4')}
      >
        <Icon size={18} strokeWidth={1.25} />
        <Text>{label}</Text>
      </Flex>
    </Link>
  )
}
