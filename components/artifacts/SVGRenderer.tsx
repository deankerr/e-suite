'use client'

import { useEffect, useRef } from 'react'
import DOMPurify from 'dompurify'

export const SVGRenderer = ({ svgText }: { svgText: string }) => {
  const svgContainerRef = useRef<HTMLDivElement>(null)
  const processedSVG = DOMPurify.sanitize(svgText, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['animate'],
  })

  useEffect(() => {
    const container = svgContainerRef.current
    if (!container) return

    container.innerHTML = processedSVG
  }, [processedSVG])

  return (
    <div
      ref={svgContainerRef}
      className="overflow-hidden rounded-md border"
      tabIndex={0}
      aria-label="Rendered SVG content"
      role="img"
    />
  )
}
