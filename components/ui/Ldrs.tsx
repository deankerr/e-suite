import { useEffect } from 'react'

type LoaderProps = {
  color?: string | number
  size?: string | number
  speed?: string | number
}

export function DotWave({ color = 'var(--accent-11)', size, speed }: LoaderProps) {
  useEffect(() => {
    async function getLoader() {
      const { dotWave } = await import('ldrs')
      dotWave.register()
    }
    getLoader()
  }, [])
  return <l-dot-wave color={color} size={size} speed={speed}></l-dot-wave>
}

export function DotStream({ color = 'var(--accent-11)', size, speed }: LoaderProps) {
  useEffect(() => {
    async function getLoader() {
      const { dotStream } = await import('ldrs')
      dotStream.register()
    }
    getLoader()
  }, [])
  return <l-dot-stream color={color} size={size} speed={speed}></l-dot-stream>
}

export function LineZoom({ color = 'var(--accent-11)', size, speed }: LoaderProps) {
  useEffect(() => {
    async function getLoader() {
      const { zoomies } = await import('ldrs')
      zoomies.register()
    }
    getLoader()
  }, [])
  return <l-zoomies color={color} size={size} speed={speed}></l-zoomies>
}

export function LineOscillate({ color = 'var(--accent-11)', size, speed }: LoaderProps) {
  useEffect(() => {
    async function getLoader() {
      const { lineWobble } = await import('ldrs')
      lineWobble.register()
    }
    getLoader()
  }, [])
  return <l-line-wobble color={color} size={size} speed={speed}></l-line-wobble>
}

export function Mirage({ color = 'var(--accent-11)', size, speed }: LoaderProps) {
  useEffect(() => {
    async function getLoader() {
      const { mirage } = await import('ldrs')
      mirage.register()
    }
    getLoader()
  }, [])
  return <l-mirage color={color} size={size} speed={speed}></l-mirage>
}

export function Orbit({ color = 'var(--accent-11)', size, speed }: LoaderProps) {
  useEffect(() => {
    async function getLoader() {
      const { orbit } = await import('ldrs')
      orbit.register()
    }
    getLoader()
  }, [])
  return <l-orbit color={color} size={size} speed={speed}></l-orbit>
}
