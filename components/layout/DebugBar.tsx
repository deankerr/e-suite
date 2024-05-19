'use client'

import { Label } from '@radix-ui/react-label'
import { Checkbox } from '@radix-ui/themes'
import { useAtom } from 'jotai'

import { NonSecureAdminRoleOnly } from '@/components/util/NonSecureAdminRoleOnly'
import { mountInputBarAtom } from '@/lib/atoms'
import { cn } from '@/lib/utils'

type DebugBarProps = { props?: unknown } & React.ComponentProps<'div'>

export const DebugBar = ({ className, ...props }: DebugBarProps) => {
  const [mountInputBar, setMountInputBar] = useAtom(mountInputBarAtom)
  return (
    <NonSecureAdminRoleOnly>
      <div
        {...props}
        className={cn(
          'absolute top-12 z-50 flex-none px-1 font-mono text-xs text-gray-11 flex-center md:static',
          className,
        )}
      >
        <Label>
          input-bar{' '}
          <Checkbox checked={mountInputBar} onCheckedChange={(c) => setMountInputBar(Boolean(c))} />
        </Label>
      </div>
    </NonSecureAdminRoleOnly>
  )
}
