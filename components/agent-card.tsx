import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loading } from '@/components/ui/loading'
import { Agent } from '@/lib/db'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useRef } from 'react'

export function AgentCard({ agent, className }: { agent: Agent } & React.ComponentProps<'div'>) {
  return (
    <section className={cn('grid grid-cols-[auto_1fr] gap-4 rounded-md border p-6', className)}>
      <div className="">
        <Image src={'/' + agent.image} width={100} height={100} alt="display picture" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-lg font-semibold leading-none">{agent.name}</span>
          <RenameDialog current={agent.name ?? ''} onSubmit={(name) => {}}>
            <Button variant="outline" size="sm" disabled={false}>
              {/* {mutator.isPending ? <Loading size="xs" /> : 'Rename'} */}
              Rename
            </Button>
          </RenameDialog>
        </div>
        <div>
          <CardItem label="engine" value={agent.engine.displayName} />
        </div>
      </div>
    </section>
  )
}

function CardItem({ label = '', value = '' }) {
  return (
    <div className="h-full">
      <span className="text-sm text-muted-foreground ">{label}</span>
      <div className="font-mono">{value}</div>
    </div>
  )
}

function RenameDialog({
  children,
  current,
  onSubmit,
}: {
  children: React.ReactNode
  current: string
  onSubmit: (value: string) => unknown
}) {
  const ref = useRef<HTMLInputElement | null>(null)

  const submit = () => {
    const value = ref.current?.value
    if (value) onSubmit(value)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename Agent</DialogTitle>
          {/* <DialogDescription>Rename Agent</DialogDescription> */}
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="agent-name" className="sr-only">
              Name
            </Label>
            <Input ref={ref} id="agent-name" defaultValue={current} />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={submit}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
