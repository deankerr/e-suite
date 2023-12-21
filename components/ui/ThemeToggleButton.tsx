'use client'

import { cn } from '@/lib/utils'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { IconButton } from './Button'

type ThemeToggleButtonProps = {
  props?: any
} & React.ComponentProps<'button'>

export const ThemeToggleButton = ({ className }: ThemeToggleButtonProps) => {
  const { theme, setTheme } = useTheme()
  const current = theme === 'dark' ? 'dark' : 'light'
  return (
    <IconButton
      onClick={() => {
        setTheme(current === 'dark' ? 'light' : 'dark')
      }}
      className={cn('bg-n-950 text-n-300 hover:bg-n-900 hover:text-n-100', className)}
    >
      {current === 'dark' ? (
        <MoonIcon className="size-6 flex-shrink-0" />
      ) : (
        <SunIcon className="size-6 flex-shrink-0" />
      )}
    </IconButton>
  )
}
