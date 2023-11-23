import { cn } from '@/lib/utils'
import Image from 'next/image'

export function AppPanel({ className, children }: {} & React.ComponentProps<'div'>) {
  return <div className={cn('h-full divide-y', className)}>{children}</div>
}

function Header({
  title,
  imageStart,
  children,
  className,
}: {
  title?: React.ReactNode
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
      {title && <h2 className={cn('py-2 text-lg font-semibold leading-none')}>{title}</h2>}
      {children}
    </div>
  )
}

function Section({
  children,
  className,
}: { children?: React.ReactNode } & React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col py-3', className)}>{children}</div>
}

function SectionHead({
  children,
  className,
}: { children?: React.ReactNode } & React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex items-center justify-between px-5 font-medium leading-none', className)}
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
