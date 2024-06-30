import { useRef, useState } from 'react'
import { Button } from '@radix-ui/themes'
import AudioMotionAnalyzer from 'audiomotion-analyzer'
import { Howl, Howler } from 'howler'

export default function Av() {
  const visualizerRef = useRef<HTMLDivElement>(null)

  const [howl, setHowl] = useState<Howl | null>(null)
  const [audioMotion, setAudioMotion] = useState<AudioMotionAnalyzer | null>(null)

  const createMedia = () => {
    if (!visualizerRef.current) return

    const audio = new Howl({
      src: 'https://mysaqemvwxduynavbong.supabase.co/storage/v1/object/public/test/Ek%20Pal%20Ka%20Jeena.mp3',
      autoplay: true,
    })

    const node = (audio as any)._sounds[0]._node as AudioNode

    const newAudioMotion = new AudioMotionAnalyzer(visualizerRef.current, {
      audioCtx: Howler.ctx,
      source: node,
      showFPS: true,
      connectSpeakers: false,

      height: 400,

      ansiBands: false,
      showScaleX: false,
      bgAlpha: 0,
      overlay: true,
      mode: 5,
      frequencyScale: 'log',
      showPeaks: true,
      smoothing: 0.7,
      ledBars: false,
      gradient: 'orangered',
    })

    setHowl(audio)
    setAudioMotion(newAudioMotion)
  }

  console.log(howl, audioMotion)
  return (
    <div className="">
      <Button onClick={createMedia}>start</Button>
      {/* {howl ? <Button>{howl.state}</Button> : null} */}
      <div ref={visualizerRef} className="h-30 w-full"></div>
    </div>
  )
}
