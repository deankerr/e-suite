import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Link } from '@radix-ui/themes'

export default function NotFound() {
  return (
    <div className="flex-col-center h-dvh w-full gap-4">
      <Icons.Ghost
        weight="thin"
        className="pointer-events-none fixed aspect-square h-[120vh] w-[120vw] shrink-0 text-grayA-11 opacity-[0.02]"
      />

      <div className="flex-between gap-4">
        <h1 className="text-2xl font-medium">404</h1>
        <div className="h-16 w-px bg-gray-5" />
        <p className="text-sm font-medium">The page could not be found.</p>
      </div>

      <Link href="/" size="2" className="-mb-8">
        Home
      </Link>
    </div>
  )
}
