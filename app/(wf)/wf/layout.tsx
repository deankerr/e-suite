import { Heading } from '@radix-ui/themes'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // AppLayout

  return (
    <div className="flex h-full">
      {/* sidebar */}
      <div className="flex w-60 flex-col bg-blue-5">
        <div className="h-12 bg-blue-3 text-center">
          <Heading size="7" className="text-accent">
            eg-drop
          </Heading>
        </div>
        <div className="grow"></div>
        <div className="h-8 bg-blue-7">footer</div>
      </div>

      {/* content */}
      <div className="flex grow flex-col bg-pink-7">
        <div className="h-12 bg-purple-4">header</div>

        <div className="flex grow">
          <div className="w-60 bg-green-5">left bar</div>
          {children}
          <div className="w-60 bg-green-5">right bar</div>
        </div>

        <div className="h-6 bg-purple-7">footer</div>
      </div>
    </div>
  )
}
