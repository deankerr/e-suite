import { Button } from '@radix-ui/themes'

export default function Page() {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="h-11 border-b p-1">Thread Message Feed</div>

      <div className="grow space-y-4 p-2 px-8 py-4">
        <div className="flex flex-col gap-2 border p-2">
          <div className="flex gap-2">
            <div className="h-10 w-10 rounded-full bg-gray-11"></div>
            <div className="text-sm font-semibold">John Doe</div>
            <div className="text-sm text-gray-11">12:00</div>

            <div>
              <Button size="1">Trash</Button>
            </div>
          </div>
          <div className="text-sm text-gray-11">Hello</div>
        </div>

        <div className="flex flex-col gap-2 border p-2">
          <div className="flex gap-2">
            <div className="h-10 w-10 rounded-full bg-gray-11"></div>
            <div className="text-sm font-semibold">John Doe</div>
            <div className="text-sm text-gray-11">12:00</div>

            <div>
              <Button size="1">Trash</Button>
            </div>
          </div>
          <div className="text-sm text-gray-11">Hello</div>
        </div>

        <div className="flex flex-col gap-2 border p-2">
          <div className="flex gap-2">
            <div className="h-10 w-10 rounded-full bg-gray-11"></div>
            <div className="text-sm font-semibold">John Doe</div>
            <div className="text-sm text-gray-11">12:00</div>

            <div>
              <Button size="1">Trash</Button>
            </div>
          </div>
          <div className="text-sm text-gray-11">Hello</div>
        </div>
      </div>

      <div className="h-11 shrink-0 border-t p-1">Footer </div>
    </div>
  )
}
