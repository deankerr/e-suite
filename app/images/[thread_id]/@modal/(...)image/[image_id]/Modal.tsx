'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { usePathname, useRouter } from 'next/navigation'

import { IconButton } from '@/components/ui/Button'

export const Modal = ({
  children,
  closePathname,
}: {
  children: React.ReactNode
  closePathname?: string
}) => {
  const router = useRouter()
  const pathname = usePathname()
  if (pathname === closePathname) return null
  return (
    <div className="absolute bottom-0 top-10 w-full bg-blackA-1">
      <div className="absolute -top-9 right-1">
        <IconButton aria-label="Close" variant="ghost" onClick={() => router.back()}>
          <Icons.X size={18} />
        </IconButton>
      </div>
      {children}
    </div>
  )
}
