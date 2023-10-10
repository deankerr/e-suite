import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash'
import c from 'react-syntax-highlighter/dist/cjs/languages/prism/c'
import csharp from 'react-syntax-highlighter/dist/cjs/languages/prism/csharp'
import docker from 'react-syntax-highlighter/dist/cjs/languages/prism/docker'
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json'
import lua from 'react-syntax-highlighter/dist/cjs/languages/prism/lua'
import markdown from 'react-syntax-highlighter/dist/cjs/languages/prism/markdown'
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python'
import ruby from 'react-syntax-highlighter/dist/cjs/languages/prism/ruby'
import rust from 'react-syntax-highlighter/dist/cjs/languages/prism/rust'
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss'
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx'
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript'
import zig from 'react-syntax-highlighter/dist/cjs/languages/prism/zig'
import * as PT from 'react-syntax-highlighter/dist/cjs/styles/prism'
import remarkGfm from 'remark-gfm'

SyntaxHighlighter.registerLanguage('tsx', tsx)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('scss', scss)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('markdown', markdown)
SyntaxHighlighter.registerLanguage('json', json)
SyntaxHighlighter.registerLanguage('c', c)
SyntaxHighlighter.registerLanguage('csharp', csharp)
SyntaxHighlighter.registerLanguage('docker', docker)
SyntaxHighlighter.registerLanguage('docker', docker)
SyntaxHighlighter.registerLanguage('lua', lua)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('ruby', ruby)
SyntaxHighlighter.registerLanguage('rust', rust)
SyntaxHighlighter.registerLanguage('zig', zig)

// const style = PT.tomorrow
// const style = PT.coldarkDark
const style = PT.darcula
// const style = PT.nord

//* all
// const style = PT.coy
// const style = PT.dark
// const style = PT.funky
// const style = PT.okaidia
// const style = PT.solarizedlight
// const style = PT.tomorrow
// const style = PT.twilight
// const style = PT.prism
// const style = PT.a11yDark
// const style = PT.atomDark
// const style = PT.base16AteliersulphurpoolLight
// const style = PT.cb
// const style = PT.coldarkCold
// const style = PT.coldarkDark
// const style = PT.darcula
// const style = PT.dracula
// const style = PT.duotoneDark
// const style = PT.duotoneEarth
// const style = PT.duotoneForest
// const style = PT.duotoneLight
// const style = PT.duotoneSea
// const style = PT.duotoneSpace
// const style = PT.ghcolors
// const style = PT.materialDark
// const style = PT.materialLight
// const style = PT.materialOceanic
// const style = PT.nightOwl
// const style = PT.nord
// const style = PT.oneDark
// const style = PT.oneLight
// const style = PT.pojoaque
// const style = PT.shadesOfPurple
// const style = PT.synthwave84
// const style = PT.vs
// const style = PT.vscDarkPlus
// const style = PT.xonokai

export function Markdown({ children }: { children: string | null | undefined }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ children, className, node, ...rest }) {
          const match = /language-(\w+)/.exec(className || '')
          return match ? (
            <SyntaxHighlighter
              style={style}
              language={match[1]}
              PreTag="div"
              customStyle={{ fontFamily: 'unset' }}
              className="rounded-md font-mono text-sm"
              codeTagProps={{}}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          )
        },
        pre({ children, className, node, ...props }) {
          return (
            <pre className={cn(className, 'not-prose max-w-[65ch] rounded-md')} {...props}>
              {children}
            </pre>
          )
        },
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
