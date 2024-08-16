export const metadata = {
  title: '',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden border-gray-5 bg-gray-2 transition-colors md:rounded-md md:border">
      {children}
    </div>
  )
}
