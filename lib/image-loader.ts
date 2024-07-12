import { environment, isValidUrl } from '@/lib/utils'

const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL!
export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  const url = new URL(baseUrl)

  // external/public image
  if (isValidUrl(src) || src.startsWith('/')) {
    url.searchParams.append('image', src)
  } else {
    // backend image
    url.pathname += src
  }

  if (environment !== 'prod') {
    url.searchParams.append('dev', 'true')
  }

  url.searchParams.append('w', width.toString())
  url.searchParams.append('q', quality?.toString() || '75')

  return url.toString()
}
