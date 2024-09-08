'use client'

import { SandpackLayout, SandpackPreview, SandpackProvider } from '@codesandbox/sandpack-react'
import { gruvboxDark } from '@codesandbox/sandpack-themes'

import { Panel } from '@/components/ui/Panel'

export default function Page() {
  return (
    <Panel>
      <SandpackProvider
        template="react-ts"
        files={{
          'App.tsx': `export default function App() { return <p>Hello, world!</p> }`,
        }}
        theme={gruvboxDark}
        options={{}}
      >
        <SandpackLayout>
          <SandpackPreview />
        </SandpackLayout>
      </SandpackProvider>
    </Panel>
  )
}
