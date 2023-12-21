type ChatInputProps = {
  props?: any
}

export const ChatInput = ({ props }: ChatInputProps) => {
  return (
    <div className="w-full border-2 border-slate-400">
      <form>
        <label htmlFor="chat" className="sr-only">
          Your message
        </label>
        <textarea
          id="chat"
          rows={1}
          className="mx-4 block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="Your message..."
        ></textarea>
      </form>
    </div>
  )
}
