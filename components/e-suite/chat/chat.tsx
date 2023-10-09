import { Button } from '@/components/ui/button'
import {
  CodeSandboxLogoIcon,
  FaceIcon,
  MixerHorizontalIcon,
  PaperPlaneIcon,
  SketchLogoIcon,
} from '@radix-ui/react-icons'
import { ChatInputPanel } from './input-panel'

type Props = {}

export function ChatApp(props: Props) {
  return (
    <div id="e-chat-component" className="flex grow flex-col rounded-md border-2 bg-background">
      {/* Title/Controls */}
      <div className="flex items-center border-b bg-muted px-2 py-1 font-medium">
        <Button variant="ghost" size="icon" className="">
          <FaceIcon />
        </Button>
        <div className="h-full grow text-center">Alpaca Banana</div>
        <div>
          <Button variant="outline" size="icon" className="">
            <MixerHorizontalIcon />
          </Button>
          <Button variant="outline" size="icon" className="">
            <SketchLogoIcon />
          </Button>
          <Button variant="outline" size="icon" className="">
            <CodeSandboxLogoIcon />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div id="e-messages" className="flex grow flex-col justify-end space-y-4 px-4 py-4">
        <div
          id="e-chat-system"
          className="mx-auto max-w-[75%] rounded-lg bg-secondary px-3 py-2 text-center text-secondary-foreground shadow"
        >
          You are a helpful assistant. Use Markdown.
        </div>
        <div
          id="e-chat-user"
          className="max-w-[75%] rounded-lg bg-primary px-3 py-2 text-primary-foreground shadow"
        >
          I would like to ask you many questions.
        </div>
        <div id="e-chat-ai" className="ml-auto max-w-[75%] rounded-lg bg-muted px-3 py-2 shadow">
          As an AI, I cannot assist with this task.
        </div>
        <div
          id="e-chat-user"
          className="max-w-[75%] rounded-lg bg-primary px-3 py-2 text-primary-foreground shadow"
        >
          Im saddened to hear that.
        </div>
        <div id="e-chat-ai" className="ml-auto max-w-[75%] rounded-lg bg-muted px-3 py-2 shadow">
          As an AI, get used to it.
        </div>
      </div>

      {/* Input */}
      {/* <div className="bg-amber-100">
        <Textarea placeholder="Enter your message..." />
        <Button variant="secondary" size="icon" className="absolute right-4 top-[0.8em] shadow">
          <PaperPlaneIcon />
        </Button>
      </div> */}
      <ChatInputPanel />
    </div>
  )
}
