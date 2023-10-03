import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

type ChatMessageItem = {
  role: 'system' | 'user' | 'assistant'
  name?: string
  content: string
}

export default function Chat() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-end border-x border-base-200 bg-base-100 pb-24">
        <div className="px-2 pb-2">
          {_sampleMessages.map((msg, i) =>
            msg.role === 'system' ? (
              <SystemBubble content={msg.content} key={i} />
            ) : (
              <MessageBubble message={msg} key={i} />
            ),
          )}
        </div>
        <InputPanel />
      </div>
    </div>
  )
}

function InputPanel() {
  return (
    <div className="fixed bottom-0 flex w-full max-w-md justify-center bg-base-200 px-4 py-2">
      <InputBox />
    </div>
  )
}

function SystemBubble(props: { content: string }) {
  const { content } = props
  return (
    <div className="mx-auto max-w-sm">
      <div className="text-sm">System</div>
      <div className="rounded-lg bg-accent px-4 py-1 text-center">{content}</div>
    </div>
  )
}

function MessageBubble({ message }: { message: ChatMessageItem }) {
  const { role } = message
  const color = role === 'user' ? 'chat-bubble-primary' : 'chat-bubble-secondary'
  const alignment = role === 'user' ? 'chat-start' : 'chat-end'
  const name = message.name ?? (role === 'user' ? 'User' : 'Assistant')

  return (
    <div className={`chat ${alignment}`}>
      <div className="chat-header">{name}</div>
      <div className={`chat-bubble ${color}`}>{message.content}</div>
    </div>
  )
}

function InputBox() {
  return (
    <div className="flex w-full justify-center gap-2 align-middle">
      <textarea
        placeholder="Enter your message..."
        className="textarea textarea-bordered textarea-sm flex-auto"
      ></textarea>

      <div className="flex flex-col justify-center">
        <button className="btn btn-circle btn-accent">
          <PaperAirplaneIcon className="w-8" />
        </button>
      </div>
    </div>
  )
}

const _sampleMessages: ChatMessageItem[] = [
  { role: 'system', content: 'Adipisicing exercitation ut sit aute fugiat duis enim ad.' },
  {
    role: 'user',
    name: 'Katelynn',
    content: 'In elit laborum sunt sint consequat incididunt eiusmod occaecat.',
  },
  {
    role: 'assistant',
    content:
      'Et amet ullamco exercitation ad nulla esse adipisicing do cupidatat cillum non sit excepteur reprehenderit cillum. Commodo in laborum consequat quis deserunt esse. Eiusmod ex magna eu culpa id dolore culpa laboris tempor. Ea laboris excepteur sint dolor elit nisi anim exercitation ipsum sunt cupidatat consectetur labore aliqua nostrud. Ullamco dolore laboris id.',
  },
  {
    role: 'user',
    name: 'Katelynn',
    content: 'Ut pariatur fugiat irure anim mollit ad amet.',
  },
  {
    role: 'assistant',
    content:
      'Amet ad Lorem cillum. Minim aliqua culpa exercitation aute ipsum sunt incididunt culpa quis culpa duis eu consectetur duis esse. Laboris consequat occaecat deserunt consequat cupidatat nisi. Nostrud duis officia velit dolore reprehenderit eiusmod id non elit aliqua adipisicing elit. Ad duis mollit enim aliqua pariatur non magna ad amet id ad dolore nulla incididunt dolore. Sunt ex consectetur aliqua dolor aliquip. Elit et quis pariatur cillum dolore culpa consequat nisi duis ad amet sint duis commodo proident.',
  },
  {
    role: 'user',
    name: 'Katelynn',
    content: 'Eiusmod non sit cillum dolore nulla.',
  },
  {
    role: 'assistant',
    content:
      'Officia sint in adipisicing ex exercitation. Quis voluptate cupidatat consequat Lorem aute exercitation anim mollit amet labore cupidatat qui Lorem exercitation. Eu tempor non dolor nulla esse culpa. Aliqua in non mollit tempor ea. Dolore ex aliqua esse proident amet ullamco commodo proident amet esse non pariatur. Sunt incididunt non veniam ea enim veniam voluptate.',
  },
  {
    role: 'user',
    name: 'Katelynn',
    content: 'Minim ut incididunt eu proident.',
  },
  {
    role: 'assistant',
    content:
      'Elit dolore aliqua in voluptate anim quis pariatur amet elit laboris ut amet et nostrud. Amet laboris cillum esse sunt commodo irure. Dolore laborum ad velit cillum sunt. Do elit occaecat est dolore proident in qui minim exercitation excepteur et nisi proident pariatur cupidatat. Nulla consequat ex pariatur exercitation officia eu est. Aliquip cupidatat reprehenderit aliquip ad commodo voluptate id et cupidatat aliquip eu sint non. Qui excepteur proident voluptate id ut consequat fugiat.',
  },
]

const _sampleMessagesFew = _sampleMessages.slice(0, 3)
