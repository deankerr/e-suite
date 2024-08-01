'use client'

import { forwardRef } from 'react'
import dynamic from 'next/dynamic'

import type { MDXEditorMethods, MDXEditorProps } from '@mdxeditor/editor'

const Editor = dynamic(() => import('./InternalMDXEditor'), {
  ssr: false,
})

// This is what is imported by other components. Pre-initialized with plugins, and ready
// to accept other props, including a ref.
export const MDXEditor = forwardRef<MDXEditorMethods, MDXEditorProps>((props, ref) => (
  <Editor {...props} editorRef={ref} />
))
MDXEditor.displayName = 'ForwardRefEditor'
