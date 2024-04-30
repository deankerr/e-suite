'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Theme } from '@radix-ui/themes'
import { useRouter } from 'next/navigation'

type ModalPageProps = { children?: React.ReactNode }

export const ModalPage = ({ children }: ModalPageProps) => {
  const router = useRouter()

  return (
    <Dialog.Root defaultOpen onOpenChange={(open) => !open && router.back()} modal>
      <Dialog.Portal>
        <Theme>
          <Dialog.Overlay className="fixed inset-0 grid place-items-center overflow-y-auto bg-gray-1">
            <Dialog.Content className="w-full">{children}</Dialog.Content>
          </Dialog.Overlay>
        </Theme>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
