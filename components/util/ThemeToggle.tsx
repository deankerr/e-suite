'use client'

import { useEffect, useState } from 'react'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { UIIconButton } from '../ui/UIIconButton'

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <UIIconButton
      label="toggle theme"
      icon={theme === 'light' ? SunIcon : MoonIcon}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    />
  )
}
