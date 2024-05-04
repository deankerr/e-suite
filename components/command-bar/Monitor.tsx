import { useThreadCtx } from '@/lib/queries'

export const Monitor = () => {
  const thread = useThreadCtx()

  return (
    <div className="absolute inset-y-0 right-0 font-mono text-xs">
      {thread && <div>t:{thread.title ?? thread.rid}</div>}
    </div>
  )
}
