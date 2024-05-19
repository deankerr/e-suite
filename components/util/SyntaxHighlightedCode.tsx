'use client'

import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

export function SyntaxHighlightedCode(props: Partial<React.ComponentProps<'code'>>) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (ref.current && props.className?.includes('lang-') && window.hljs) {
      // false positives
      window.hljs.configure({ ignoreUnescapedHTML: true })

      window.hljs.highlightElement(ref.current)

      // hljs won't reprocess the element unless this attribute is removed
      ref.current.removeAttribute('data-highlighted')
    }
  }, [props.className, props.children])

  return <code {...props} className={cn(props.className, 'not-prose')} ref={ref} />
}
