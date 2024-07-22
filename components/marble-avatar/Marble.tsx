import { memo, useId, useMemo } from 'react'

import { colors } from '@/components/marble-avatar/colors'

// adapted from https://github.com/boringdesigners/boring-avatars/tree/master

const ELEMENTS = 3
const SIZE = 80

type MarbleProperties = ReturnType<typeof generateMarbleProperties>
const generateMarbleProperties = (name: string) => {
  const numFromName = hashCode(name)
  const range = colors && colors.length

  const elementsProperties = Array.from({ length: ELEMENTS }, (_, i) => ({
    color: getRandomColor(numFromName + i * 3, colors, range),
    translateX: getUnit(numFromName * (i + 1), SIZE / 10, 1),
    translateY: getUnit(numFromName * (i + 1), SIZE / 10, 2),
    scale: 1.2 + getUnit(numFromName * (i + 1), SIZE / 20) / 10,
    rotate: getUnit(numFromName * (i + 1), 360, 1),
  }))

  type ElProps = (typeof elementsProperties)[number]
  return elementsProperties as [ElProps, ElProps, ElProps]
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

const getDigit = (number: number, ntn: number) => {
  return Math.floor((number / Math.pow(10, ntn)) % 10)
}

export const useMarbleProperties = (name: string) => {
  return useMemo(() => generateMarbleProperties(name), [name])
}

export const Marble = memo(function Marble({
  name,
  properties,
  size,
  square = false,
}: {
  name: string
  properties: MarbleProperties
  size: number
  square?: boolean
}) {
  const maskID = useId()

  return (
    <svg
      viewBox={'0 0 ' + SIZE + ' ' + SIZE}
      fill="none"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
    >
      <title>{`${name}'s avatar`}</title>
      <mask id={maskID} maskUnits="userSpaceOnUse" x={0} y={0} width={SIZE} height={SIZE}>
        <rect width={SIZE} height={SIZE} rx={square ? undefined : SIZE * 2} fill="#FFFFFF" />
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
  )
})
