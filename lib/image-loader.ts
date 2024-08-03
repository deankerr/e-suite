const devImageUrl = process.env.NEXT_PUBLIC_DEV_IMAGE_URL

export default function imageLoader({ src, width }: { src: string; width: number }) {
  if (devImageUrl) return `${devImageUrl}${src}?w=${width}&dev=true`
  return `${src}?w=${width}`
}
