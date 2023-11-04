export function BottomPanel() {
  return (
    <div className="flex items-center justify-between border-t bg-background px-3">
      <div></div>
      <span className="hidden text-sm text-muted-foreground sm:flex">
        Press Enter ⏎ for a new line / Press ⌘ + Enter to send
      </span>
      <div></div>
    </div>
  )
}
