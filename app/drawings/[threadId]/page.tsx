'use client'

import { useMemo, useRef } from 'react'

import { useMessageFeedQuery, useThread } from '@/app/lib/api/threads'
import { SVGRenderer } from '@/components/artifacts/SVGRenderer'
import { VirtualizedFeed } from '@/components/feed/VirtualizedFeed'
import { NavigationButton } from '@/components/navigation/NavigationSheet'
import { EmptyPage } from '@/components/pages/EmptyPage'
import { Loader } from '@/components/ui/Loader'
import { Panel, PanelHeader, PanelLoading, PanelTitle } from '@/components/ui/Panel'

export default function Page({ params }: { params: { threadId: string } }) {
  const thread = useThread(params.threadId)

  const { results, loadMore, status } = useMessageFeedQuery(params.threadId)
  const hasSkippedFirstLoad = useRef(false)

  const svgMessages = useMemo(() => {
    return results
      .map((msg) => {
        const svg = extractSVG(msg.text ?? '')
        if (!svg) return null
        return {
          _id: msg._id,
          ...svg,
        }
      })
      .filter((val) => val !== null)
      .reverse()
  }, [results])

  if (!thread) {
    if (thread === null) return <EmptyPage />
    return <PanelLoading />
  }

  return (
    <Panel>
      <PanelHeader>
        <NavigationButton />
        <PanelTitle href={`/drawings/${thread.slug}`}>
          {thread.title ?? 'Untitled Thread'}
        </PanelTitle>
        <div className="grow" />
        {status === 'LoadingMore' && <Loader type="orbit" />}
      </PanelHeader>

      <div className="grow">
        <VirtualizedFeed
          items={svgMessages}
          renderItem={(item) => (
            <SVGContainer
              _id={item._id}
              width={item.width}
              height={item.height}
              title={item.title}
              svgText={item.svgText}
            />
          )}
          onAtTop={() => {
            if (status === 'CanLoadMore') {
              if (!hasSkippedFirstLoad.current) {
                hasSkippedFirstLoad.current = true
                return console.log('skipped first load')
              }
              loadMore(30)
            }
          }}
        />
      </div>
    </Panel>
  )
}

type ExtractedSVG = {
  svgText: string
  width: string
  height: string
  title: string
}

const SVGContainer = ({
  svgText,
  width,
  height,
  title,
}: {
  _id: string
} & ExtractedSVG) => {
  return (
    <div className="flex-center overflow-hidden p-1" style={{ width, height }} title={title}>
      <SVGRenderer svgText={svgText} sanitize={false} />
    </div>
  )
}

const extractSVG = (text: string) => {
  const svgRegex = /```svg\n([\s\S]*?)\n```/g
  const match = svgRegex.exec(text)

  if (!match) return null

  const svgContent = match[1] as string
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgContent, 'image/svg+xml')
  const svgElement = doc.querySelector('svg')

  if (!svgElement) return null

  const width = svgElement.getAttribute('width') || ''
  const height = svgElement.getAttribute('height') || ''
  const title = svgElement.querySelector('title')?.textContent || ''

  return {
    width,
    height,
    title,
    svgText: svgContent.trim(),
  }
}
