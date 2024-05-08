'use client'

import 'jotai-devtools/styles.css'

import { DevTools } from 'jotai-devtools'

type JotaiDevToolsProps = React.ComponentProps<typeof DevTools>

const JotaiDevTools = (props: JotaiDevToolsProps) => {
  return <DevTools {...props} />
}

export default JotaiDevTools
