'use client'

import { Sandpack } from '@codesandbox/sandpack-react'
import { gruvboxDark } from '@codesandbox/sandpack-themes'

export default function Page() {
  return (
    <Sandpack
      template="react-ts"
      files={{
        'App.tsx': `export default function App() { return <p>Hello, world!</p> }`,
      }}
      theme={gruvboxDark}
      options={
        {
          // editorHeight: '98vh',
        }
      }
    />
  )
}
