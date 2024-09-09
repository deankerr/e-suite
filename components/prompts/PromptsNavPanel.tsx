'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { usePrompts } from '@/app/lib/api/prompts'
import { NavigationButton } from '@/components/navigation/NavigationSheet'
import { Button } from '@/components/ui/Button'
import { NavPanel, PanelHeader, PanelTitle } from '@/components/ui/Panel'
import { VScrollArea } from '@/components/ui/VScrollArea'
import { cn } from '@/lib/utils'

export const PromptsNavPanel = () => {
  const params = useParams()
  const prompts = usePrompts()

  return (
    <NavPanel>
      <PanelHeader>
        <NavigationButton />
        <PanelTitle href="/prompts">Prompts</PanelTitle>

        <div className="grow" />
        <Link href="/prompts/new">
          <Button variant="surface">
            Create <Icons.Plus size={20} />
          </Button>
        </Link>
      </PanelHeader>

      <VScrollArea>
        <div className="flex flex-col gap-1 overflow-hidden p-1">
          {prompts?.map((prompt) => (
            <Link
              key={prompt._id}
              href={`/prompts/${prompt._id}`}
              className={cn(
                'truncate rounded-sm px-2 py-3 text-sm font-medium hover:bg-gray-2',
                prompt._id === params.textsId && 'bg-gray-3 hover:bg-gray-3',
              )}
            >
              {prompt.title ?? 'Untitled'}
            </Link>
          ))}
        </div>
      </VScrollArea>
    </NavPanel>
  )
}
