type IconButtonProps = {
  props?: any
}

export const IconButton = ({ children }: React.ComponentProps<'button'>) => {
  return (
    <button
      type="button"
      className="flex h-[2.875rem] w-[2.875rem] flex-shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent bg-gray-900 text-sm font-semibold text-zinc-400 hover:bg-gray-700 disabled:pointer-events-none disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
    >
      {children}
    </button>
  )
}
