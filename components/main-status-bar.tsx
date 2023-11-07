import { auth } from '@/auth'

export async function MainStatusBar() {
  const session = await auth()

  return (
    <div className="flex items-center justify-between border-t border-t-primary bg-background px-3 text-xs text-muted-foreground">
      <div>{new Date().toLocaleTimeString()}</div>
      <div className="font-mono">{session && `${session?.user.role}.${session?.user.id}`}</div>
      <div></div>
    </div>
  )
}
