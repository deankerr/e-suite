export const ThreadPanel = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="hidden h-full w-full overflow-hidden border-grayA-5 bg-gray-2 last:block md:block md:rounded-md md:border">
      {children}
    </div>
  )
}
