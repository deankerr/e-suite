import { Logo } from '@/components/ui/Logo'

export default function Loading() {
  return (
    <div className="flex h-full w-full">
      <Logo className="m-auto size-48 animate-pulse brightness-[.25] saturate-0" />
    </div>
  )
}
