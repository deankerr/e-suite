import * as Icons from '@phosphor-icons/react/dist/ssr'
import { ScrollArea } from '@radix-ui/themes'

import { NavSheet } from '@/app/NavRail'
import { GenerationForm } from '@/components/generation/GenerationForm'
import { IconButton } from '@/components/ui/Button'
import { Section, SectionHeader } from '@/components/ui/Section'

export const GenerationSection = () => {
  return (
    <Section className="w-80 shrink-0">
      <SectionHeader>
        <div className="flex-start">
          <NavSheet>
            <IconButton variant="ghost" aria-label="Open navigation sheet" className="md:invisible">
              <Icons.List size={20} />
            </IconButton>
          </NavSheet>
          Generate
        </div>

        <div className="grow" />

        <div>
          <IconButton variant="ghost" aria-label="Close" className="hidden">
            <Icons.X size={18} />
          </IconButton>
        </div>
      </SectionHeader>

      <ScrollArea>
        <GenerationForm />
      </ScrollArea>
    </Section>
  )
}
