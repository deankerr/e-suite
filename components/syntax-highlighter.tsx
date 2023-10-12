import { PrismLight } from 'react-syntax-highlighter'
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

PrismLight.registerLanguage('tsx', tsx)
PrismLight.registerLanguage('typescript', typescript)
PrismLight.registerLanguage('scss', scss)
PrismLight.registerLanguage('bash', bash)
PrismLight.registerLanguage('markdown', markdown)
PrismLight.registerLanguage('json', json)
PrismLight.registerLanguage('c', c)
PrismLight.registerLanguage('csharp', csharp)
PrismLight.registerLanguage('docker', docker)
PrismLight.registerLanguage('docker', docker)
PrismLight.registerLanguage('lua', lua)
PrismLight.registerLanguage('python', python)
PrismLight.registerLanguage('ruby', ruby)
PrismLight.registerLanguage('rust', rust)
PrismLight.registerLanguage('zig', zig)

// const style = PT.tomorrow
// const style = PT.coldarkDark
const style = PT.darcula
// const style = PT.nord

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
