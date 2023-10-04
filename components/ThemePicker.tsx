'use client'

import { useLocalStorage } from '@uidotdev/usehooks'
import { useEffect } from 'react'

export function ThemePicker() {
  const [theme, setTheme] = useLocalStorage('theme', 'default')
  console.log('theme', theme)

  useEffect(() => {
    const body = document.body
    if (theme === 'default' && body.getAttribute('data-theme')) {
      body.removeAttribute('data-theme')
    } else if (body.getAttribute('data-theme') !== theme) {
      body.setAttribute('data-theme', theme)
    }
  }, [theme])

  return (
    <>
      <select
        className="select select-accent w-full max-w-xs"
        name="themePicker"
        value={theme}
        onChange={(event) => setTheme(event.target.value)}
      >
        {themesList.map((t) => (
          <option value={t} key={t}>
            {t}
          </option>
        ))}
      </select>
    </>
  )
}

const themesList = [
  'default',
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
]
