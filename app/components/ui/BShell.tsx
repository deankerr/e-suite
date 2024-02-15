import { cn } from '@/lib/utils'
import { Heading } from '@radix-ui/themes'
import { PanelTopIcon } from 'lucide-react'
import { forwardRef } from 'react'
import { IconButton } from './IconButton'

type Props = {}

const Root = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(function Root(
  { className, ...props },
  forwardedRef,
) {
  return (
    <div
      {...props}
      className={cn(
        'grid grid-rows-[2rem_minmax(auto,_calc(100vh-2rem))]',
        'rounded border bg-panel-translucent',
        className,
      )}
      ref={forwardedRef}
    />
  )
})

type TitlebarProps = { icon?: React.ReactNode }

export const Titlebar = forwardRef<HTMLDivElement, TitlebarProps & React.ComponentProps<'div'>>(
  function Titlebar({ children, className, icon, ...props }, forwardedRef) {
    return (
      <div {...props} className={cn('flex items-center border-b', className)} ref={forwardedRef}>
        <IconButton variant="ghost" className="m-0">
          {icon ?? <PanelTopIcon className="size-5 stroke-1" />}
        </IconButton>
        <Heading size="3">{children}</Heading>
      </div>
    )
  },
)

type ContentProps = {}

export const Content = forwardRef<HTMLDivElement, ContentProps & React.ComponentProps<'div'>>(
  function Content({ children, className, ...props }, forwardedRef) {
    return (
      <div {...props} className={cn('', className)} ref={forwardedRef}>
        {children}
      </div>
    )
  },
)

export const BShell = Object.assign({}, { Root, Titlebar, Content })
