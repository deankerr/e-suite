import { Fragment } from 'react'
import Markdown from 'markdown-to-jsx'

import { SyntaxHighlightedCode } from '@/components/util/SyntaxHighlightedCode'
import { cn } from '@/lib/utils'

import type { EMessageWithContent } from '@/convex/shared/structures'

type MessageTextContentProps = {
  content: EMessageWithContent['content']
} & React.ComponentProps<'div'>

export const MessageTextContent = ({ content, className, ...props }: MessageTextContentProps) => {
  if (!content) return null

  return (
    <div {...props} className={cn('', className)}>
      <div className="font-mono text-xs text-gray-11">text</div>
      <div className="prose prose-stone prose-invert mx-auto min-h-6 max-w-none prose-h1:mb-2 prose-h1:text-lg prose-h2:mb-2 prose-h2:mt-1 prose-h2:text-lg prose-h3:mb-2 prose-h3:mt-1 prose-pre:p-0">
        <Markdown
          options={{
            wrapper: Fragment,
            disableParsingRawHTML: true,
            overrides: {
              code: SyntaxHighlightedCode,
            },
          }}
        >
          {content}
        </Markdown>
      </div>
    </div>
  )
}
