'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { usePathname, useRouter } from 'next/navigation'

import { IconButton } from '@/components/ui/Button'

export const Modal = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()
  return (
    <div className="absolute bottom-0 top-10 w-full bg-gray-1">
      <div className="absolute -top-9 right-1">
        <IconButton
          aria-label="Close"
          variant="ghost"
          onClick={() => router.push(pathname.split('/').slice(0, 3).join('/'))}
        >
          <Icons.X size={18} />
        </IconButton>
      </div>
      {children}
    </div>
  )
}
