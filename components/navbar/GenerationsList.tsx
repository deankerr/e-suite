'use client'

import { cn } from '@/lib/utils'
import { Heading, ScrollArea } from '@radix-ui/themes'
import { FileImageIcon, MessageCirclePlusIcon } from 'lucide-react'
import NextLink from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'
import { forwardRef } from 'react'
import { useAppStore } from '../providers/AppStoreProvider'

type GenerationsListProps = {} & React.ComponentProps<typeof ScrollArea>

export const GenerationsList = forwardRef<HTMLDivElement, GenerationsListProps>(
  function GenerationsList({ className, ...props }, forwardedRef) {
    const [route, routeId] = useSelectedLayoutSegments()
    const isActive = (slug?: string) => route === 'generate' && routeId === slug

    const generationsList = useAppStore((state) => state.generationsList)
    const generations = generationsList?.map((generation) => ({
      ...generation,
      title: generation.images ? generation.images[0]?.parameters?.prompt : 'new generation',
    }))
    return (
      <ScrollArea
        {...props}
        ref={forwardedRef}
        scrollbars="vertical"
        className={cn('grow', className)}
      >
        <NextLink
          href={`/generate`}
          className={cn(
            'flex-between h-16 gap-1 border-b px-4 hover:bg-gray-2',
            isActive(undefined) && 'bg-gray-2',
          )}
        >
          <MessageCirclePlusIcon />
          <Heading size="3" className="grow px-4">
            New Generation
          </Heading>
        </NextLink>
        <div className="flex flex-col divide-y divide-gray-5">
          {generations?.map(({ _id, title }) => (
            <NextLink
              key={_id}
              href={`/generate/${_id}`}
              className={cn(
                'flex h-16 w-screen shrink-0 items-center gap-1 overflow-hidden py-3 pr-3 sm:w-80',
                isActive(_id) ? 'bg-gray-2' : 'hover:bg-gray-2',
              )}
            >
              {/* icon */}
              <div className="flex shrink-0 flex-col justify-center px-4">
                <FileImageIcon
                  className={cn('size-5 text-gray-11', isActive(_id) && 'text-gray-12')}
                />
              </div>

              {/* details */}
              <div className="flex flex-col gap-1">
                {/* title */}
                <Heading
                  size="2"
                  className={cn('truncate text-gray-11', isActive(_id) && 'text-gray-12')}
                >
                  {title}
                </Heading>

                {/* model name */}
                {/* <div className={cn('text-xs text-gray-10', isActive(_id) && 'text-gray-11')}>
                {formatModelString(parameters?.model)}
              </div> */}
              </div>
            </NextLink>
          ))}
        </div>
      </ScrollArea>
    )
  },
)
