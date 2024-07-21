import { useId } from 'react'

// adapted from https://github.com/boringdesigners/boring-avatars/tree/master

const ELEMENTS = 3
const SIZE = 80

function generateColors(name: string, colors: string[]) {
  const numFromName = hashCode(name)
  const range = colors && colors.length

  const elementsProperties = Array.from({ length: ELEMENTS }, (_, i) => ({
    color: getRandomColor(numFromName + i, colors, range),
    translateX: getUnit(numFromName * (i + 1), SIZE / 10, 1),
    translateY: getUnit(numFromName * (i + 1), SIZE / 10, 2),
    scale: 1.2 + getUnit(numFromName * (i + 1), SIZE / 20) / 10,
    rotate: getUnit(numFromName * (i + 1), 360, 1),
  }))

  type ElProps = (typeof elementsProperties)[number]
  return elementsProperties as [ElProps, ElProps, ElProps]
}

export const MarbleAvatar = (props: {
  name: string
  size: number
  square?: boolean
  // colors: string[]
}) => {
  const properties = generateColors(props.name, colors)
  const maskID = useId()

  const primaryColor = properties[0].color
  return (
    <>
      {/* line */}
      <div
        className="absolute bottom-2 right-0 top-4 w-1/2 border-l opacity-50"
        style={{ borderColor: primaryColor }}
      ></div>

      {/* marble */}
      <svg
        viewBox={'0 0 ' + SIZE + ' ' + SIZE}
        fill="none"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        width={props.size}
        height={props.size}
      >
        {/* {props.title && <title>{props.name}</title>} */}
        <mask id={maskID} maskUnits="userSpaceOnUse" x={0} y={0} width={SIZE} height={SIZE}>
          <rect
            width={SIZE}
            height={SIZE}
            rx={props.square ? undefined : SIZE * 2}
            fill="#FFFFFF"
          />
        </mask>
        <g mask={`url(#${maskID})`}>
          <rect width={SIZE} height={SIZE} fill={properties[0].color} />
          <path
            filter={`url(#filter_${maskID})`}
            d="M32.414 59.35L50.376 70.5H72.5v-71H33.728L26.5 13.381l19.057 27.08L32.414 59.35z"
            fill={properties[1].color}
            transform={
              'translate(' +
              properties[1].translateX +
              ' ' +
              properties[1].translateY +
              ') rotate(' +
              properties[1].rotate +
              ' ' +
              SIZE / 2 +
              ' ' +
              SIZE / 2 +
              ') scale(' +
              properties[2].scale +
              ')'
            }
          />
          <path
            filter={`url(#filter_${maskID})`}
            style={{
              mixBlendMode: 'overlay',
            }}
            d="M22.216 24L0 46.75l14.108 38.129L78 86l-3.081-59.276-22.378 4.005 12.972 20.186-23.35 27.395L22.215 24z"
            fill={properties[2].color}
            transform={
              'translate(' +
              properties[2].translateX +
              ' ' +
              properties[2].translateY +
              ') rotate(' +
              properties[2].rotate +
              ' ' +
              SIZE / 2 +
              ' ' +
              SIZE / 2 +
              ') scale(' +
              properties[2].scale +
              ')'
            }
          />
        </g>
        <defs>
          <filter
            id={`filter_${maskID}`}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation={7} result="effect1_foregroundBlur" />
          </filter>
        </defs>
      </svg>

      {/* {properties.map((props, i) => (
        <div
          key={i}
          style={{ backgroundColor: props.color, width: '90px', height: '30px', flexShrink: '0' }}
        >
          {props.color}
        </div>
      ))} */}
    </>
  )
}

const hashCode = (name: string) => {
  var hash = 0
  for (var i = 0; i < name.length; i++) {
    var character = name.charCodeAt(i)
    hash = (hash << 5) - hash + character
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

const getRandomColor = (number: number, colors: string[], range: number) => {
  return colors[number % range]
}

const getUnit = (number: number, range: number, index?: number) => {
  const value = number % range

  if (index && getDigit(number, index) % 2 === 0) {
    return -value
  } else return value
}

export const getDigit = (number: number, ntn: number) => {
  return Math.floor((number / Math.pow(10, ntn)) % 10)
}

const colors = [
  '#FFCA16',
  '#e54d2e',
  '#ff8dcc',
  '#d4b3a5',
  '#ff92ad',
  '#b1a9ff',
  '#ab4aba',
  '#ffa057',
  '#00a2c7',
  '#9eb1ff',
  '#3dd68c',
  '#5b5bd6',
  '#f76b15',
  '#bde56c',
  '#0090ff',
  '#0bd8b6',
  '#46a758',
  '#12a594',
  '#8e4ec6',
  '#FFC53D',
  '#ff9592',
  '#75c7f0',
  '#dbb594',
  '#ffe629',
  '#7ce2fe',
  '#4ccce6',
  '#70b8ff',
  '#3e63dd',
  '#ff977d',
  '#cbb99f',
  '#30a46c',
  '#d6409f',
  '#e5484d',
  '#d19dff',
  '#71d083',
  '#f5e147',
  '#bdee63',
  '#e796f3',
  '#e93d82',
]
