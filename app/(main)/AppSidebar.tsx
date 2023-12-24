'use client'

import { cn } from '@/lib/utils'
import { Box, Flex, Separator, Text } from '@radix-ui/themes'
import logo from '/assets/icons/logo-sunset.svg'
import {
  BotIcon,
  CherryIcon,
  ComponentIcon,
  HomeIcon,
  LogInIcon,
  LucideIcon,
  MessageSquareTextIcon,
  PanelLeftCloseIcon,
  SunIcon,
  UserPlus,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

const nodes1 = [
  { href: '/', icon: <HomeIcon size={18} strokeWidth={1.25} />, label: 'Dashboard' },
  { href: '/chat', icon: <MessageSquareTextIcon size={18} strokeWidth={1.25} />, label: 'Chat' },
  { href: '#', icon: <ComponentIcon size={18} strokeWidth={1.25} />, label: 'Models' },
  { href: '/agents', icon: <BotIcon size={18} strokeWidth={1.25} />, label: 'Agents' },
]

const nodes2 = [
  { href: '#', icon: <LogInIcon size={18} strokeWidth={1.25} />, label: 'Log In' },
  { href: '#', icon: <UserPlus size={18} strokeWidth={1.25} />, label: 'Sign Up' },
]

export const AppSidebar = () => {
  return (
    <Box className="w-64 flex-none border-r border-gray-5">
      {/* Logo */}
      <Box px="4" py="4">
        <Link href="/" className="flex items-center gap-2 pl-0">
          <Image src={logo} alt="e/suite logo" className="-mb-1 size-10" priority />
          <h3 className="font-semibold tracking-tighter">e/suite</h3>
        </Link>
      </Box>

      {/* Nav */}
      <Flex direction="column" gap="1" px="2">
        {nodes1.map((n, i) => (
          <Node key={`${n.href}-${n.label}-${i}`} href={n.href} icon={n.icon} label={n.label} />
        ))}
        <Separator my="2" size="4" />
        {nodes2.map((n, i) => (
          <Node key={`${n.href}-${n.label}-${i}`} href={n.href} icon={n.icon} label={n.label} />
        ))}
      </Flex>
    </Box>
  )
}

type NodeProps = {
  href: string
  icon: React.ReactNode
  label: string
}

const Node = ({ href, icon, label }: NodeProps) => {
  const segment = useSelectedLayoutSegment()
  const isActive = '/' + (segment ?? '') === href
  return (
    <Link href={href}>
      <Flex
        gap="3"
        px="3"
        py="2"
        align="center"
        className={cn('rounded transition-colors', isActive ? 'bg-gray-5' : 'hover:bg-gray-4')}
      >
        {icon}
        <Text>{label}</Text>
      </Flex>
    </Link>
  )
}
