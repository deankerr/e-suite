'use client'

import { Dialog } from '@radix-ui/themes'
import { useRouter } from 'next/navigation'

type ModalPageViewProps = { children?: React.ReactNode }

export const ModalPageView = ({ children }: ModalPageViewProps) => {
  const router = useRouter()

  return (
    <Dialog.Root defaultOpen onOpenChange={(open) => !open && router.back()}>
      <Dialog.Content size="1" maxWidth="90vw" style={{ width: '90vw', height: '90vh' }}>
        {children}
      </Dialog.Content>
    </Dialog.Root>
  )
}
