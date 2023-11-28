import { getRandomName } from '@/lib/utils'
import { useRef, useState } from 'react'
import { shuffle } from 'remeda'
import { useCreateAgent } from './queries'
import { Button } from './ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Loading } from './ui/loading'

export function CreateAgentDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const createAgent = useCreateAgent()
  const { status } = createAgent

  if ((status === 'success' || status === 'error') && open) {
    createAgent.reset()
    setOpen(false)
  }

  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Agent</DialogTitle>
          {/* <DialogDescription></DialogDescription> */}
        </DialogHeader>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input id="name" ref={inputRef} defaultValue={getRandomName()} className="col-span-3" />
        </div>

        <DialogFooter className="sm:justify-start md:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>

          {status !== 'pending' && (
            <Button
              onClick={() => {
                if (inputRef.current && inputRef.current.value !== '') {
                  createAgent.mutate(inputRef.current.value)
                }
              }}
            >
              Create
            </Button>
          )}

          {status === 'pending' && (
            <Button>
              <Loading size="sm" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
