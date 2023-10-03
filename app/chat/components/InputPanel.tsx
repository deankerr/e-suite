import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

export function InputPanel() {
  return (
    <div className="fixed bottom-0 flex w-full max-w-md justify-center rounded-md bg-base-300 px-4 py-2">
      <div className="flex w-full justify-center gap-4 align-middle">
        <textarea
          placeholder="Enter your message..."
          className="font textarea textarea-accent textarea-sm flex-auto"
        ></textarea>

        <div className="flex flex-col justify-center">
          <button className="btn btn-circle btn-accent">
            <PaperAirplaneIcon className="w-8" />
          </button>
        </div>
      </div>
    </div>
  )
}
