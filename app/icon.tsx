/* eslint-disable @next/next/no-img-element */
import svgToDataUri from 'mini-svg-data-uri'
import { ImageResponse } from 'next/og'

import { environment } from '@/app/lib/utils'

export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

const orange = '#FF9F6A'
const amber = '#ffd60a'
const gold = '#a39073'

const color = environment === 'prod' ? orange : environment === 'prev' ? amber : gold

const sun = svgToDataUri(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200pt" height="1200pt" version="1.1" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
  <g fill="${color}">
    <path
      d="m1097.4 847.32h-994.8c-10.078 0-18.238 8.2812-18.238 18.238 0 10.078 8.2812 18.121 18.238 18.121h994.92c10.078 0 18.238-8.1602 18.238-18.121 0-10.078-8.2812-18.238-18.363-18.238z" />
    <path
      d="m999.24 969.36h-798.48c-10.078 0-18.238 8.2812-18.238 18.238 0 10.078 8.2812 18.238 18.238 18.238h798.36c10.078 0 18.238-8.2812 18.238-18.238 0.12109-9.957-8.1602-18.238-18.121-18.238z" />
    <path
      d="m753.6 1091.5h-307.2c-10.078 0-18.238 8.1602-18.238 18.121 0 10.078 8.2812 18.238 18.238 18.238h307.2c10.078 0 18.238-8.2812 18.238-18.238 0.125-9.9609-8.1562-18.121-18.234-18.121z" />
    <path
      d="m97.801 759.36c0.48047 1.3203 1.8008 2.2812 3.4805 2.2812h997.56c1.5586 0 3-0.96094 3.4805-2.2812 5.3984-16.32 9.9609-32.762 13.441-49.078 8.2812-36.602 12.359-74.762 12.359-113.28 0-145.08-58.32-280.2-164.04-380.28-99.363-93.957-227.52-144.72-363.72-144.72-10.199 0-20.398 0.23828-30.602 0.83984-282.6 15.602-505.92 257.76-497.52 539.88 0.96094 33 5.0391 65.762 12.121 97.441 3.4805 16.441 8.0391 32.879 13.441 49.199z" />
  </g>
</svg>`)

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      (<img alt="" width={32} height={32} src={sun} />)
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    },
  );
}
