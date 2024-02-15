import { Label } from '@/app/components/ui/Label'
import { Permissions as PermissionsType } from '@/convex/schema'
import { cn } from '@/lib/utils'
import { Heading, Switch } from '@radix-ui/themes'
import { forwardRef, useEffect, useState } from 'react'

type Props = {
  permissions: PermissionsType
  onPermissionsChange: (permissions: PermissionsType) => void
}

export const Permissions = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function Permissions({ permissions, onPermissionsChange, className, ...props }, forwardedRef) {
    const [privateValue, setPrivateValue] = useState(permissions.private)

    // lock options on change until update received
    const [privateValueLocked, setPrivateValueLocked] = useState(false)
    useEffect(() => {
      setPrivateValue(permissions.private)
      setPrivateValueLocked(false)
    }, [permissions.private])
    return (
      <div
        {...props}
        className={cn(
          'space-y-1 rounded border border-gold-7 bg-surface p-2 text-xs transition-transform',
          className,
        )}
        ref={forwardedRef}
      >
        <div className="flex items-center justify-between ">
          <Heading size="1">Visibility</Heading>
          <div className="flex items-center gap-2">
            <Label htmlFor="private" className="text-xs font-medium">
              Private
            </Label>
            <Switch
              id="private"
              size="1"
              checked={privateValue}
              onCheckedChange={(value) => {
                if (privateValueLocked) return
                setPrivateValue(value)
                setPrivateValueLocked(true)
                onPermissionsChange({ ...permissions, private: value })
              }}
            />
          </div>
        </div>
        {permissions.private ? (
          <p>Only you can see this item.</p>
        ) : (
          <p>This item is shared with the world.</p>
        )}
      </div>
    )
  },
)
