import { Editor, Node, Transforms } from 'slate'

import type { BaseEditor, Descendant } from 'slate'
import type { ReactEditor } from 'slate-react'

// Define a serializing function that takes a value and returns a string.
export const serialize = (value: Descendant[]) => {
  return (
    value
      // Return the string content of each paragraph in the value's children.
      .map((n) => Node.string(n))
      // Join them all with line breaks denoting paragraphs.
      .join('\n')
  )
}

// Define a deserializing function that takes a string and returns a value.
export const deserialize = (string: string) => {
  // Return a value array of children derived by splitting the string.
  return string.split('\n').map((line) => {
    return {
      children: [{ text: line }],
    }
  }) as Descendant[]
}

export const getEditorStorageText = (storageKey: string) => {
  return localStorage.getItem(storageKey) || ''
}

export const removeEditorStorageText = (storageKey: string) => {
  localStorage.removeItem(storageKey)
}

export const replaceEditorText = (editor: BaseEditor & ReactEditor, newText: string) => {
  // clear all previous text
  Transforms.delete(editor, {
    at: {
      anchor: Editor.start(editor, []),
      focus: Editor.end(editor, []),
    },
  })

  // insert new text
  if (newText && newText !== '') {
    // don't insert empty text - results in strange visual behavior
    Transforms.insertNodes(
      editor,
      [
        {
          type: 'paragraph',
          children: [{ text: newText }],
        },
      ],
      {
        at: [0],
      },
    )
  }
}
