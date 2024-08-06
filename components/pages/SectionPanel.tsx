'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { ScrollArea } from '@radix-ui/themes'

import { SidebarButton } from '@/components/layout/SidebarButton'
import { IconButton } from '@/components/ui/Button'
import { LineZoom } from '@/components/ui/Ldrs'

export const SectionPanel = ({
  title,
  toolbar,
  onClosePanel,
  loading = false,
  children,
}: {
  title?: string
  toolbar?: React.ReactNode
  onClosePanel?: () => void
  loading?: boolean
  children?: React.ReactNode
}) => {
  return (
    <section className="h-full w-full min-w-[50%] overflow-hidden border-grayA-5 bg-gray-2 md:rounded-md md:border">
      <div className="flex h-full flex-col overflow-hidden">
        <header className="flex-start h-10 border-b border-grayA-3 bg-gray-3 px-1 font-medium">
          <div className="flex-start shrink-0 gap-1">
            {/* <IconButton variant="ghost" color="gray" aria-label="More options" disabled>
              <Icons.Dot size={20} />
            </IconButton> */}
            <SidebarButton />
          </div>

          <div className="grow truncate text-sm">{title}</div>

          <div className="flex-end shrink-0 gap-1">
            {onClosePanel && (
              <IconButton variant="ghost" aria-label="Close" onClick={onClosePanel}>
                <Icons.X size={20} />
              </IconButton>
            )}
          </div>
        </header>

        {loading ? (
          <div className="flex-col-center h-full">
            <LineZoom color="var(--accent-11)" />
          </div>
        ) : (
          <>
            {toolbar}
            <ScrollArea scrollbars="vertical" className="grow">
              {children}
            </ScrollArea>
          </>
        )}
      </div>
    </section>
  )
}
