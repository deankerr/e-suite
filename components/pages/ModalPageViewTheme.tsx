'use client'

import { Dialog } from '@radix-ui/themes'
import { useRouter } from 'next/navigation'

type ModalPageViewProps = { children?: React.ReactNode }

export const ModalPageViewTheme = ({ children }: ModalPageViewProps) => {
  const router = useRouter()

  return (
    <Dialog.Root defaultOpen onOpenChange={(open) => !open && router.back()}>
      <Dialog.Content size="1" maxWidth="90vw" className="h-[90vh] bg-gray-1">
        {children}
      </Dialog.Content>
    </Dialog.Root>
  )
}
