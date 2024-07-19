import { Logo } from '@/components/ui/Logo'

export default function Page() {
  return (
    <div className="absolute inset-0 z-30 flex bg-gray-1">
      <Logo className="m-auto size-48 animate-pulse brightness-[.25] saturate-0" />
    </div>
  )
}
