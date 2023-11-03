import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Engine } from '@prisma/client'
import { Button } from '../ui/button'
import { EngineTable } from './engine-table'

export function EngineBrowser({
  current,
  className,
  ...props
}: { current: Engine } & React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('', className)} {...props}>
      <div className="space-y-1.5 p-6">
        <h3 className="font-semibold leading-none tracking-tight">Engine Browser</h3>
      </div>
      <Input placeholder="search for a model" />
      <p>search info/feedback</p>
      <EngineTable engine={current} />
    </div>
  )
}
