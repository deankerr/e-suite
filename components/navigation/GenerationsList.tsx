'use client'

import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import { FileImageIcon, PlusCircleIcon } from 'lucide-react'
import NextLink from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'
import { forwardRef } from 'react'
import { Button } from '../ui/Button'
import { ItemLink } from './ItemLink'

type GenerationsListProps = {} & React.ComponentProps<typeof ScrollArea>

export const GenerationsList = forwardRef<HTMLDivElement, GenerationsListProps>(
  function GenerationsList({ className, ...props }, forwardedRef) {
    const [route, routeId] = useSelectedLayoutSegments()
    const isActive = (slug?: string) => route === 'generate' && routeId === slug

    const generationsList = useQuery(api.generations.do.list, {})

    const generations = generationsList?.map((generation) => ({
      ...generation,
      title: generation.images ? generation.images[0]?.parameters?.prompt : '...',
    }))
    return (
      <div className="flex grow flex-col overflow-hidden">
        {/* new */}
        <div className="flex flex-col px-2.5 pb-2 pt-2.5 shadow-md">
          <Button size="3" variant="surface" className="flex-between" asChild>
            <NextLink href={'/generate'}>
              <div className="w-4">
                <PlusCircleIcon className="size-4" />
              </div>
              <div>Create</div>
              <div className="w-4"></div>
            </NextLink>
          </Button>
        </div>
        {/* list */}
        <ScrollArea
          {...props}
          ref={forwardedRef}
          scrollbars="vertical"
          className={cn('grow', className)}
        >
          <div className="w-80 px-1.5">
            <div className="flex flex-col gap-0.5 px-1">
              {generations?.map(({ _id, title }) => (
                <ItemLink
                  key={_id}
                  href={`/generate/${_id}`}
                  title={title ?? '...'}
                  icon={<FileImageIcon className="size-5 stroke-[1.5]" />}
                  isActive={isActive(_id)}
                />
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    )
  },
)
