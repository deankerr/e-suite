import { useEffect, useRef } from 'react'
import { atom, useAtom } from 'jotai'

type ConfettiInstance = {
  id: number
  onComplete: () => void
}

const confettiAtom = atom<ConfettiInstance[]>([])

export const useConfetti = () => {
  const [confettiInstances, setConfettiInstances] = useAtom(confettiAtom)
  const instanceRef = useRef<ConfettiInstance | null>(null)

  useEffect(() => {
    return () => {
      if (instanceRef.current) {
        setConfettiInstances((prevInstances) =>
          prevInstances.filter((instance) => instance !== instanceRef.current),
        )
      }
    }
  }, [setConfettiInstances])

  const playConfetti = () => {
    const newInstance: ConfettiInstance = {
      id: Date.now(),
      onComplete: () => {
        setConfettiInstances((prevInstances) =>
          prevInstances.filter((instance) => instance !== newInstance),
        )
      },
    }

    instanceRef.current = newInstance
    setConfettiInstances((prevInstances) => [...prevInstances, newInstance])
  }

  return { playConfetti, confettiInstances }
}
