import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export const Markdown = ({ children }: { children: string | null | undefined }) => {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
}
