'use client'

export default function loader({ src, width }: { src: string; width: number }) {
  const url = `${src}?w=${width}`
  return url
}
