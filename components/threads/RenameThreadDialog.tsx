import { forwardRef, useCallback, useMemo } from 'react'
import { Dialog } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { useAtomCallback } from 'jotai/utils'
import { toast } from 'sonner'

import { Button } from '@/components/ui/Button'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { createTextInputAtom } from '../atoms'
import { TextInput } from '../ui/TextInput'

type RenameThreadDialogProps = { id?: Id<'threads'>; currentTitle?: string } & React.ComponentProps<
  typeof Dialog.Root
>

export const RenameThreadDialog = forwardRef<HTMLDivElement, RenameThreadDialogProps>(
  function RenameThreadDialog({ currentTitle, id, children, ...props }, forwardedRef) {
    const runUpdateTitle = useMutation(api.threads.threads.updateTitle)

    const inputAtom = useMemo(
      () =>
        createTextInputAtom({
          label: 'Thread title',
          name: 'thread_title',
          initialValue: currentTitle ?? '',
        }),
      [currentTitle],
    )
    const readValue = useAtomCallback(useCallback((get) => get(inputAtom.atom), [inputAtom.atom]))

    const handleSave = () => {
      if (!id) return

      const newTitle = readValue()
      if (!newTitle) return

      runUpdateTitle({ id, title: newTitle.slice(0, 64) })
        .then(() => {
          toast.success('Thread renamed')
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
          <Dialog.Title>Edit Title</Dialog.Title>

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
