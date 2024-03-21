import { cn } from '@/lib/utils'
import { Heading } from '@radix-ui/themes'

type GenerateProps = {} & React.ComponentProps<'div'>

export const Generate = ({ className, ...props }: GenerateProps) => {
  // Generate
  return (
    <div {...props} className={cn('flex grow flex-col overflow-hidden', className)}>
      {/* header */}
      <div className="flex-between h-[--e-header-h] shrink-0 border-b px-3">
        <div className="flex-between gap-2">
          <Heading size="3">Generate</Heading>
          <Heading size="4" className="text-accent-11">
            /
          </Heading>
          <Heading size="3">New</Heading>
        </div>
      </div>

      {/* main */}
      <div className="flex h-full">
        {/* content */}
        <div className="bg-grid-dark flex-center grow">Image Bay</div>

        {/* sidebar */}
        <div className="flex-center w-80 shrink-0 border-l">Sidebar</div>
      </div>
    </div>
  )
}
