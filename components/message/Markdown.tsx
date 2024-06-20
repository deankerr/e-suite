import { Fragment } from 'react'
import MarkdownToJsx from 'markdown-to-jsx'

import { SyntaxHighlightedCode } from '@/components/util/SyntaxHighlightedCode'

export const Markdown = ({ children }: { children?: string }) => {
  if (!children) return null

  return (
    <MarkdownToJsx
      options={{
        wrapper: Fragment,
        disableParsingRawHTML: true,
        overrides: {
          code: SyntaxHighlightedCode,
        },
      }}
    >
      {children}
    </MarkdownToJsx>
  )
}
