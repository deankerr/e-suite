import { SvgImage } from '@/components/util/SvgImage'

export const metadata = {
  title: 'SVG',
}

export default function Page() {
  return (
    <div className="flex h-screen flex-wrap gap-3 p-3">
      {[...Array(27)].map((_, i) => (
        <SvgImage key={i} noun={i + 1} className="h-40 w-40" />
      ))}
    </div>
  )
}
