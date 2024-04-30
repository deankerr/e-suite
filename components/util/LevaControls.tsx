'use client'

import { useKeyStroke } from '@react-hooks-library/core'
import { useWindowSize } from '@uidotdev/usehooks'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Leva } from 'leva'

import { environment } from '@/lib/utils'

const levaHiddenAtom = atomWithStorage('leva-hidden', environment === 'prod')

export const LevaControls = () => {
  const [hidden, setHidden] = useAtom(levaHiddenAtom)

  useKeyStroke(['K'], (e) => {
    if (e.ctrlKey) setHidden(!hidden)
  })

  // title bar window size / env
  const { width, height } = useWindowSize()
  const content =
    "before:content-['xs_'] sm:before:content-['sm_'] md:before:content-['md_'] lg:before:content-['lg_'] xl:before:content-['xl_'] 2xl:before:content-['2xl_']"
  const title = (
    <span className={content}>
      ⋅ {`${width}x${height}`} ⋅ {environment}
    </span>
  )

  return (
    <Leva
      hidden={hidden}
      titleBar={{
        title,
      }}
      theme={{
        colors: {
          elevation1: 'var(--brown-a2)', // top bar
          elevation2: 'var(--brown-2)', // main panel
          elevation3: 'var(--brown-4)', // controls bg
          accent1: 'var(--brown-8)', // active button
          accent2: 'var(--brown-6)', // main button color
          accent3: 'var(--brown-8)', // button hover border
          highlight1: 'var(--brown-9)', // top bar elements
          highlight2: 'var(--brown-11)', // main text color
          highlight3: 'var(--brown-11)', //  btn/checkbox/graph text/line (monitor doesn't work with var)
          vivid1: '#00FF00', // ?
        },
      }}
    />
  )
}
