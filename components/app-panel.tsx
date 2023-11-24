import { cn } from '@/lib/utils'
import Image from 'next/image'

export function AppPanel({ className, children }: {} & React.ComponentProps<'div'>) {
  return <div className={cn('h-full divide-y', className)}>{children}</div>
}

function Header({
  imageStart,
  children,
  className,
}: {
  imageStart?: string
  children?: React.ReactNode
} & React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex justify-between gap-4 px-6 py-4', className)}>
      {imageStart && (
        <Image
          src={imageStart}
          width={100}
          height={100}
          alt="display picture"
          className="box-content rounded-lg border border-muted"
        />
      )}

      {children}
    </div>
  )
}

function Section({
  children,
  className,
}: { children?: React.ReactNode } & React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col pb-4 pt-3', className)}>{children}</div>
}

function SectionHead({
  children,
  className,
}: { children?: React.ReactNode } & React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-2 px-5 font-medium leading-none',
        className,
      )}
    >
      {children}
    </div>
  )
}

function SectionBody({
  children,
  className,
}: { children?: React.ReactNode } & React.ComponentProps<'div'>) {
  return <div className={cn('px-6', className)}>{children}</div>
}

AppPanel.Header = Header
AppPanel.Section = Section
AppPanel.SectionHead = SectionHead
AppPanel.SectionBody = SectionBody
