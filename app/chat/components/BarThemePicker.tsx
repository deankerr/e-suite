'use client'

import { useLocalStorage } from '@uidotdev/usehooks'
import { useEffect } from 'react'

export function BarThemePicker() {
  const [theme, setTheme] = useLocalStorage('theme', 'default')

  useEffect(() => {
    const body = document.body
    if (theme === 'default' && body.getAttribute('data-theme')) {
      body.removeAttribute('data-theme')
    } else if (body.getAttribute('data-theme') !== theme) {
      body.setAttribute('data-theme', theme)
    }
  }, [theme])

  return (
    <select
      className="select select-ghost max-w-xs"
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
  )
}

/* 
 <li>
      <details>
        <summary>Theme</summary>
        <ul className="bg-base-100 p-2">
          {themesList.map((t) => (
            <li key={t}>
              <a>{t}</a>
            </li>
          ))}
        </ul>
      </details>
    </li>
*/

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
