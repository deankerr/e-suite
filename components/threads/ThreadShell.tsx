import { PermissionsCard } from '@/app/components/PermissionsCard'
import { Button } from '@/app/components/ui/Button'
import { IconButton } from '@/app/components/ui/IconButton'
import { useThread } from '@/components/threads/useThread'
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { Heading, Tabs } from '@radix-ui/themes'
import { MenuSquareIcon, SlidersHorizontalIcon, XIcon } from 'lucide-react'
import { forwardRef, useState } from 'react'
import { FallbackProps } from 'react-error-boundary'
import { useGlobalAudioPlayer } from 'react-use-audio-player'
import { useChatListOpenAtom } from '../atoms'
import { useAudio, useEnqueueAudio } from '../audio/useAudio'
import { CShell } from '../ui/CShell'
import { InferenceParameterControls } from './InferenceParameterControls'
import { MessageFeed } from './MessageFeed'
import { MessageInput } from './MessageInput'
import { RemoveThreadDialog } from './RemoveThreadDialog'
import { RenameThreadDialog } from './RenameThreadDialog'

type ThreadShellProps = {
  threadId?: Id<'threads'>
} & React.ComponentProps<typeof CShell.Root>

export const ThreadShell = forwardRef<HTMLDivElement, ThreadShellProps>(function ThreadShell(
  { threadId, className, ...props },
  forwardedRef,
) {
  const { thread, messages, send, threadAtoms, updatePermissions } = useThread({ threadId })
  const title = thread ? thread.title : threadId ? 'Loading...' : 'New Chat'

  const [menuOpen, setMenuOpen] = useState(false)

  const { open } = useChatListOpenAtom()

  // const { enqueue, clearQueue, audioPlayer, queue, currentMessageId, playingIndex } =
  //   useVoiceoverPlayer(messages, true)

  useAudio()
  const [_, enqueue] = useEnqueueAudio()
  enqueue(
    messages
      .filter((m) => m.voiceover?.url)
      .map((m) => ({ messageId: m._id, url: m.voiceover?.url ?? '', played: false })),
  )

  const audioPlayer = useGlobalAudioPlayer()
  return (
    <CShell.Root {...props} className={cn('bg-gray-1', className)} ref={forwardedRef}>
      {/* content */}
      <CShell.Content>
        <CShell.Titlebar className="justify-between">
          <div className="flex items-center">
            <IconButton
              lucideIcon={MenuSquareIcon}
              onClick={open}
              variant="ghost"
              className="m-0 [&_svg]:size-7"
            />

            <Heading className="truncate" size="3">
              {title}
            </Heading>
          </div>

          <div className="flex items-center gap-1 lg:px-2">
            <IconButton
              lucideIcon={SlidersHorizontalIcon}
              variant="ghost"
              className="m-0 lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            />
          </div>
        </CShell.Titlebar>

        <MessageFeed messages={messages} />

        <MessageInput inputAtom={threadAtoms.message} onSend={send} />
      </CShell.Content>

      {/* rightbar */}
      <CShell.Sidebar side="right" open={menuOpen}>
        <Tabs.Root defaultValue="details">
          <Tabs.List>
            <Tabs.Trigger value="parameters">Parameters</Tabs.Trigger>
            <Tabs.Trigger value="details">Details</Tabs.Trigger>
            <div className="ml-auto grid place-content-center p-1">
              <IconButton
                variant="ghost"
                className="lg:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <XIcon />
              </IconButton>
            </div>
          </Tabs.List>

          <Tabs.Content value="parameters">
            <InferenceParameterControls threadAtoms={threadAtoms} />
          </Tabs.Content>

          <Tabs.Content value="details">
            <div className="flex flex-col justify-center gap-4 p-4">
              {thread && thread.owner.isViewer ? (
                <>
                  <PermissionsCard
                    permissions={thread.permissions}
                    onPermissionsChange={(permissions) => updatePermissions(permissions)}
                  />
                  <RenameThreadDialog currentTitle={thread?.title} id={thread?._id}>
                    <Button>Rename</Button>
                  </RenameThreadDialog>
                  <RemoveThreadDialog id={thread._id} onDelete={() => {}}>
                    <Button color="red">Delete Chat</Button>
                  </RemoveThreadDialog>
                </>
              ) : null}

              {/* <VoiceoverControls /> */}

              {/* <pre className="whitespace-pre-wrap bg-black text-xs">
                {JSON.stringify(currentAudio, null, 2)}
              </pre> */}
              {/* <div>{JSON.stringify(audioPlayer, null, 2)}</div> */}

              <div className="hidden border text-xs">
                {/* q {queue.length} <br /> */}
                {audioPlayer.src ?? 'no src'} <br />
                {audioPlayer.playing ? 'playing' : 'not playing'} <br />
                {audioPlayer.paused ? 'paused' : 'not paused'} <br />
                {audioPlayer.stopped ? 'stopped' : 'not stopped'} <br />
                {audioPlayer.isLoading ? 'loading' : 'not loading'} <br />
                {audioPlayer.isReady ? ' ready' : 'not ready'}
                <br />
                {/* msgId: {currentMessageId?.slice(-4)} <br /> */}
                {/* index: {playingIndex} <br /> */}
                {audioPlayer.error}
                <br />
              </div>

              {/* <pre className="whitespace-pre-wrap bg-black text-xs">
                {queue.map((audio, i) => (
                  <div key={i}>{(audio.played ? 'x' : '.') + ' ' + audio.messageId.slice(-4)}</div>
                ))}
              </pre> */}
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </CShell.Sidebar>
    </CShell.Root>
  )
})

export const FallbackComponent = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre className="mx-auto max-w-[80%] border p-1 text-sm">{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}
