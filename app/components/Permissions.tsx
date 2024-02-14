import { Label } from '@/app/components/ui/Label'
import { Permissions as PermissionsType } from '@/convex/schema'
import { cn } from '@/lib/utils'
import { Heading, Switch } from '@radix-ui/themes'
import { forwardRef } from 'react'

type Props = {
  permissions: PermissionsType
  onValueChange: (permissions: PermissionsType) => void
}

export const Permissions = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function Permissions({ onValueChange, className, ...props }, forwardedRef) {
    return (
      <div
        {...props}
        className={cn(
          'flex items-center justify-between rounded border border-gold-7 bg-surface p-2 text-sm',
          className,
        )}
        ref={forwardedRef}
      >
        <Heading size="1">Visibility</Heading>
        <div className="flex items-center gap-2">
          <Label htmlFor="private" className="text-xs font-medium">
            Private
          </Label>
          <Switch id="private" size="1" />
        </div>
      </div>
    )
  },
)
