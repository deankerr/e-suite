import { Logo } from '@/components/ui/Logo'

export default function Loading() {
  return (
    <div className="flex h-full w-full bg-gray-1">
      <Logo className="m-auto size-48 animate-pulse brightness-[.25] saturate-0" />
    </div>
  )
}
