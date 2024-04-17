import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

const sunIcon =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2aWV3Qm94PSIwIDAgNTAwIDUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSIjZmE3MjE0IiB0cmFuc2Zvcm09Im1hdHJpeCgxLjU2MjQ3Njg3MzM5NzgyNzEsIDAsIDAsIDEuNTYyNDc2ODczMzk3ODI3MSwgLTE0OS45OTM4OTY0ODQzNzUsIC0xMjguOTcwOTMyMDA2ODM1OTQpIj4KICAgIDxwYXRoIGQ9Im0xNTcuODcgMzgyLjM4YzMuMDE1NiAyLjM0MzggNi4xMTMzIDQuNTgyIDkuMjk2OSA2LjcxMDloMTc3LjY3YzMuMTc5Ny0yLjEyODkgNi4yODEyLTQuMzY3MiA5LjI5NjktNi43MTA5eiIvPgogICAgPHBhdGggZD0ibTk2IDI1NmMwIDcuMTIxMSAwLjQ2ODc1IDE0LjEzNyAxLjM3MTEgMjEuMDEyaDMxNy4yNmMwLjkwMjM0LTYuODc1IDEuMzcxMS0xMy44OTEgMS4zNzExLTIxLjAxMiAwLTIuMzM5OC0wLjA1NDY4Ny00LjY2NDEtMC4xNTIzNC02Ljk3NjZoLTMxOS43Yy0wLjA5NzY1NiAyLjMxMjUtMC4xNTIzNCA0LjYzNjctMC4xNTIzNCA2Ljk3NjZ6Ii8+CiAgICA8cGF0aCBkPSJtNDAxLjM5IDE4OS4xMmMtMjUuMzI0LTU0Ljk2NS04MC45MDItOTMuMTIxLTE0NS4zOS05My4xMjFzLTEyMC4wNyAzOC4xNTYtMTQ1LjM5IDkzLjEyMXoiLz4KICAgIDxwYXRoIGQ9Im0xMDAuNDUgMjkzLjU5YzEuNjA5NCA2LjY4NzUgMy42NDA2IDEzLjIxMSA2LjA2MjUgMTkuNTQzaDI5OC45OWMyLjQyMTktNi4zMzIgNC40NDkyLTEyLjg1NSA2LjA2MjUtMTkuNTQzeiIvPgogICAgPHBhdGggZD0ibTExNy42OSAzMzYuNDhjMS45Njg4IDMuMzc1IDQuMDU4NiA2LjY3NTggNi4yNjE3IDkuODg2N2gyNjQuMWMyLjIwMzEtMy4yMTQ4IDQuMjkzLTYuNTExNyA2LjI2MTctOS44ODY3eiIvPgogICAgPHBhdGggZD0ibTEwOC45IDE5Mi45NmMtNi4xNzU4IDE0LjM5NS0xMC4zMDEgMjkuODc5LTEyLjAwOCA0Ni4wODJoMzE4LjIyYy0xLjcwNy0xNi4yMDMtNS44MzItMzEuNjg4LTEyLjAwOC00Ni4wODJ6Ii8+CiAgPC9nPgo8L3N2Zz4='

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <img
        alt=""
        width={32}
        height={32}
        src={sunIcon}
        style={{ filter: 'hue-rotate(30deg) saturate(1.5) brightness(1.3)' }}
      />
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    },
  )
}
