'use client'

import { useEffect, useRef } from 'react'
import DOMPurify from 'dompurify'

export const SVGRenderer = ({ svgText, extra = false }: { svgText: string; extra?: boolean }) => {
  const svgContainerRef = useRef<HTMLDivElement>(null)

  const options = {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['animate'],
  }

  const optionsExtra = {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['animate', 'use'],
    ADD_ATTR: ['to', 'from', 'dominant-baseline'],
  }

  const config = extra ? optionsExtra : options
  const processedSVG = DOMPurify.sanitize(svgText, config)

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
