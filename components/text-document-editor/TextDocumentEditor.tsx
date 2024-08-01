'use client'

import { useRef } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, IconButton } from '@radix-ui/themes'

import { MDXEditor } from '../mdx-editor/MDXEditor'

import type { MDXEditorMethods } from '@mdxeditor/editor'

export const TextDocumentEditor = () => {
  const ref = useRef<MDXEditorMethods>(null)
  return (
    <>
      <div className="grid h-full w-full grid-rows-[auto_1fr_auto] overflow-hidden rounded-md border border-grayA-3 bg-gray-3">
        {/* header */}
        <div className="flex-between h-10 border-b border-grayA-3 px-2 font-medium">
          <div className="flex-start shrink-0">
            <IconButton variant="ghost" color="gray">
              <Icons.DotsNine className="size-5" />
            </IconButton>
          </div>
          Instructions
          <div className="flex-end shrink-0">
            <IconButton variant="ghost">
              <Icons.X className="size-5" />
            </IconButton>
          </div>
        </div>

        {/* text area */}
        <div className="overflow-y-auto bg-blackA-4 text-gray-12 placeholder:text-grayA-10">
          <MDXEditor ref={ref} markdown={sampleText} className="markdown-body" />
        </div>

        {/* footer */}
        <div className="flex h-12 items-center border-t border-grayA-3 px-2 text-sm">
          <Button variant="soft" size="1" color="gray">
            Thread
          </Button>

          <div className="grow" />
          <div className="flex-end shrink-0 gap-2">
            <Button color="gray" variant="solid">
              Cancel
            </Button>
            <Button variant="solid">Save</Button>
          </div>
        </div>
      </div>
    </>
  )
}

// [&_[data-lexical-editor]]

const sampleText = `
The development of the parachute in the 18th century followed the invention of the balloon. Some of the earliest tests of parachutes involved dogs, cats, and domesticated fowl. In a 19 September 1783 demonstration in Versailles observed by Marie Antoinette and Louis XVI, a duck, a rooster, and a sheep were carried by a Montgolfier brother balloon for eight minutes.


In the early 1780s, Louis-Sébastien Lenormand parachuted a cat and a dog from the top of Babotte Tower in Montpellier, France. In 1784, the Marquis de Brantes parachuted a sheep from the roof of the Palais des Papes in Avignon. Soon after, Joseph Montgolfier dropped animals from towers to test parachute-like devices.


During the balloon craze known as balloonomania in the late 18th and 19th centuries, balloonists, known then as aeronauts, began experimenting with parachuting animals.
`
