import { PrismLight } from 'react-syntax-highlighter'
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash'
import c from 'react-syntax-highlighter/dist/cjs/languages/prism/c'
import docker from 'react-syntax-highlighter/dist/cjs/languages/prism/docker'
import markdown from 'react-syntax-highlighter/dist/cjs/languages/prism/markdown'
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python'
import rust from 'react-syntax-highlighter/dist/cjs/languages/prism/rust'
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss'
import sql from 'react-syntax-highlighter/dist/cjs/languages/prism/sql'
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx'
import darcula from 'react-syntax-highlighter/dist/cjs/styles/prism/darcula'

const style = darcula

PrismLight.registerLanguage('tsx', tsx)
PrismLight.registerLanguage('scss', scss)
PrismLight.registerLanguage('bash', bash)
PrismLight.registerLanguage('sql', sql)
PrismLight.registerLanguage('markdown', markdown)
PrismLight.registerLanguage('c', c)
PrismLight.registerLanguage('docker', docker)
PrismLight.registerLanguage('python', python)
PrismLight.registerLanguage('rust', rust)

type Props = {
  children: string | string[]
  language: string | undefined
}

export function SyntaxHighlighter({ children, language }: Props) {
  return (
    <PrismLight
      style={style}
      language={language}
      PreTag="pre"
      customStyle={{ fontFamily: 'unset', margin: 0 }}
      className="rounded-md font-mono text-sm"
      codeTagProps={{}}
    >
      {children}
    </PrismLight>
  )
}
