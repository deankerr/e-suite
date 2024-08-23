import { AlertDialog } from '@radix-ui/themes'

import { Button } from '@/components/ui/Button'
import { useDeleteImage } from '@/lib/api'

import type { Id } from '@/convex/_generated/dataModel'

export const DeleteImageDialog = ({
  imageId,
  children,
  ...props
}: {
  imageId: Id<'images'>
} & React.ComponentProps<typeof AlertDialog.Root>) => {
  const sendDeleteImage = useDeleteImage()

  return (
    <AlertDialog.Root {...props}>
      {children ? <AlertDialog.Trigger>{children}</AlertDialog.Trigger> : null}

      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Delete Image</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure? This image will be gone forever.
        </AlertDialog.Description>

        <div className="flex-end mt-4 gap-2">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red" onClick={() => sendDeleteImage({ imageId })}>
              Delete
            </Button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
