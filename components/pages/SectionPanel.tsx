'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'

import { IconButton } from '@/components/ui/Button'

export const SectionPanel = ({
  title,
  onClosePanel,
  children,
}: {
  title?: string
  onClosePanel?: () => void
  children?: React.ReactNode
}) => {
  return (
    <section className="h-full w-full overflow-hidden border-grayA-5 bg-gray-2 md:rounded-md md:border">
      <div className="grid h-full grid-rows-[3rem_1fr_3rem] overflow-hidden bg-gray-2">
        <header className="flex-start border-b border-grayA-3 bg-gray-3 px-1 font-medium">
          <div className="flex-start shrink-0 gap-1">
            <IconButton variant="ghost" color="gray" aria-label="More options" disabled>
              <Icons.DotsNine size={20} />
            </IconButton>
          </div>

          <div className="grow truncate text-sm">{title}</div>

          <div className="flex-end shrink-0 gap-1">
            <IconButton variant="ghost" aria-label="Close" onClick={onClosePanel}>
              <Icons.X size={20} />
            </IconButton>
          </div>
        </header>

        {children}
      </div>
    </section>
  )
}
