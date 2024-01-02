type SkeletonProps = {
  props?: any
}

export const SkeletonChat = ({ props }: SkeletonProps) => {
  return (
    <div className="flex animate-pulse">
      <div className="flex-shrink-0">
        <span className="bg-gray-200 dark:bg-gray-700 block h-12 w-12 rounded-full"></span>
      </div>

      <div className="ms-4 mt-2 w-full">
        <h3 className="bg-gray-200 dark:bg-gray-700 h-4 w-5/12 rounded-full"></h3>

        <ul className="mt-5 space-y-3">
          <li className="bg-gray-200 dark:bg-gray-700 h-4 w-full rounded-full"></li>
          <li className="bg-gray-200 dark:bg-gray-700 h-4 w-full rounded-full"></li>
          <li className="bg-gray-200 dark:bg-gray-700 h-4 w-full rounded-full"></li>
          <li className="bg-gray-200 dark:bg-gray-700 h-4 w-full rounded-full"></li>
        </ul>
      </div>
    </div>
  )
}
