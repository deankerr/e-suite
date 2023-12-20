type IconButtonProps = {
  props?: any
}

export const IconButton = ({ children }: React.ComponentProps<'button'>) => {
  return (
    <button
      type="button"
      className="bg-n-950 text-n-400 hover:bg-n-900 hover:text-n-300 flex h-[2.875rem] w-[2.875rem] flex-shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent text-sm font-semibold transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50"
    >
      {children}
    </button>
  )
}
