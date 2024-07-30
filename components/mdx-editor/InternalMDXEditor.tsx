'use client'

import {
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  thematicBreakPlugin,
} from '@mdxeditor/editor'

import '@mdxeditor/editor/style.css'

import type { MDXEditorMethods, MDXEditorProps } from '@mdxeditor/editor'
import type { ForwardedRef } from 'react'

export default function InternalMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <MDXEditor
      plugins={[
        // Example Plugin Usage
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
      ]}
      {...props}
      ref={editorRef}
    />
  )
}
