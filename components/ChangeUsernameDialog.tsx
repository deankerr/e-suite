import { forwardRef, useCallback, useMemo } from 'react'
import { Dialog } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { useAtomCallback } from 'jotai/utils'
import { toast } from 'sonner'

import { Button } from '@/components/ui/Button'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { createTextInputAtom } from './atoms'
import { TextInput } from './ui/TextInput'

type ChangeUsernameDialogProps = { currentUsername: string } & React.ComponentProps<
  typeof Dialog.Root
>

export const ChangeUsernameDialog = forwardRef<HTMLDivElement, ChangeUsernameDialogProps>(
  function ChangeUsernameDialog({ currentUsername, children, ...props }, forwardedRef) {
    const runUpdateUsername = useMutation(api.users.updateUsername)

    const inputAtom = useMemo(
      () =>
        createTextInputAtom({
          label: 'New username',
          name: 'new_username',
          initialValue: currentUsername ?? '',
        }),
      [currentUsername],
    )
    const readValue = useAtomCallback(useCallback((get) => get(inputAtom.atom), [inputAtom.atom]))

    const handleSave = () => {
      const newUsername = readValue()
      if (!newUsername) return

      runUpdateUsername({ username: newUsername })
        .then(() => {
          toast.success('Username updated.')
        })
        .catch((error) => {
          console.error(error)
          if (error instanceof Error) {
            toast.error(error.message)
          } else {
            toast.error('An unknown error occurred.')
          }
        })
    }

    return (
      <Dialog.Root {...props}>
        <Dialog.Trigger>{children}</Dialog.Trigger>

        <Dialog.Content aria-describedby={undefined} ref={forwardedRef} className={cn('max-w-sm')}>
          <Dialog.Title>Change username</Dialog.Title>

          <div className="py-0.5">
            <TextInput inputAtom={inputAtom} hideLabel />
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close onClick={handleSave}>
              <Button variant="solid">Save</Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    )
  },
)
