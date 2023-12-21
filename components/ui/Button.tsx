import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

const button = cva('button', {
  variants: {
    type: {
      solid: {},
      outline: {},
      ghost: {},
      soft: {},
      white: {},
      link: {},
    },
  },
})

type IconButtonProps = {
  props?: any
}

export const IconButton = ({ children, className, ...props }: React.ComponentProps<'button'>) => {
  return (
    <button
      {...props}
      type="button"
      className={cn(
        'flex h-[2.875rem] w-[2.875rem] items-center justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600',
        className,
      )}
    >
      {children}
    </button>
  )
}

const iconraw = (
  <>
    <div>
      <button
        type="button"
        className="flex h-[2.875rem] w-[2.875rem] items-center justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
      ></button>
      <button
        type="button"
        className="flex h-[2.875rem] w-[2.875rem] items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
      ></button>
    </div>
  </>
)

const raw = (
  <>
    <div>
      <button
        type="button"
        className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
      >
        Solid
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-500 hover:border-blue-600 hover:text-blue-600 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:border-blue-600 dark:hover:text-blue-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
      >
        Outline
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-x-2 rounded-lg border border-transparent px-4 text-sm font-semibold text-blue-600 hover:bg-blue-100 hover:text-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:text-blue-500 dark:hover:bg-blue-800/30 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
      >
        Ghost
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-100 px-4 py-3 text-sm font-semibold text-blue-800 hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 dark:text-blue-400 dark:hover:bg-blue-900 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
      >
        Soft
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
      >
        White
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-x-2 rounded-lg border border-transparent px-4 py-3 text-sm font-semibold text-blue-600 hover:text-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
      >
        Link
      </button>
    </div>
  </>
)
