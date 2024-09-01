import { useEffect, useRef } from 'react'
import DOMPurify from 'dompurify'

export const HTMLRenderer = ({
  htmlText,
  className = '',
  sanitize = true,
}: {
  htmlText: string
  className?: string
  sanitize?: boolean
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const sanitizedHtml = sanitize ? DOMPurify.sanitize(htmlText, { WHOLE_DOCUMENT: true }) : htmlText

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    iframe.srcdoc = sanitizedHtml
  }, [sanitizedHtml])

  return (
    <iframe
      ref={iframeRef}
      title="Safe HTML Content"
      sandbox="allow-scripts"
      className={`h-full w-full border-0 ${className}`}
      tabIndex={0}
      aria-label="Rendered HTML content"
    />
  )
}
