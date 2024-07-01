import { useRef, useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, IconButton } from '@radix-ui/themes'
import AudioMotionAnalyzer from 'audiomotion-analyzer'
import { ConvexError } from 'convex/values'
import { Howl, Howler } from 'howler'
import { Play, useHowl } from 'rehowl'

import { cn } from '@/lib/utils'

export default function AudioPlayer({ url, titleText }: { url: string; titleText: string }) {
  const [playing, setPlaying] = useState(false)

  const visualizerRef = useRef<HTMLDivElement>(null)
  const [audioMotion, setAudioMotion] = useState<AudioMotionAnalyzer | null>(null)

  const { howl } = useHowl({ src: [url], format: ['mp3'], preload: true })
  const node = (howl as any)?._sounds?.[0]?._node as AudioNode

  const createAudioMotion = () => {
    if (!visualizerRef.current || audioMotion) return

    const node = (howl as any)._sounds[0]._node as AudioNode
    if (!node)
      throw new ConvexError({ message: 'node missing', data: JSON.stringify(howl, null, 2) })

    const newAudioMotion = new AudioMotionAnalyzer(visualizerRef.current, {
      audioCtx: Howler.ctx,
      source: node,
      showFPS: false,
      connectSpeakers: false,

      ansiBands: false,
      showScaleX: false,
      bgAlpha: 0,
      overlay: true,
      mode: 6,
      frequencyScale: 'log',
      showPeaks: true,
      smoothing: 0.7,
      ledBars: false,
      gradient: 'orangered',
    })

    setAudioMotion(newAudioMotion)
  }

  return (
    <div className="mx-auto aspect-[8/5] w-80 overflow-hidden rounded-lg border border-orangeA-5 bg-gradient-to-bl from-orangeA-8 to-tomato-3">
      <div ref={visualizerRef} className="h-full w-full"></div>

      {/* overlay */}
      <div className="absolute inset-0 grid p-3">
        <div className="w-full">
          <div className="text-small w-fit rounded-lg bg-grayA-2 p-1">
            <Icons.Waveform className="inline size-6" /> sound effect
          </div>
        </div>

        <div className="text-center">
          <IconButton
            variant="soft"
            size="4"
            radius="full"
            color="orange"
            onClick={() => {
              if (!node) return
              if (!audioMotion) createAudioMotion()
              setPlaying(true)
            }}
            disabled={!node}
          >
            {playing ? <Icons.Stop className="size-7" /> : <Icons.Play className="size-7" />}
          </IconButton>
        </div>

        <div className="w-full">
          <div className="mx-auto w-fit rounded-lg bg-grayA-2 p-2 font-medium">{titleText}</div>
        </div>
      </div>

      <Play
        howl={howl}
        stop={!playing}
        onEnd={() => {
          setPlaying(false)
          // onEnd?.()
        }}
      />
    </div>
  )
}
