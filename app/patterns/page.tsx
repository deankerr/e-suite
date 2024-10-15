'use client'

import { SVGProps, useState } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Code } from '@radix-ui/themes'
import ReactTextareaAutosize from 'react-textarea-autosize'

import { ModelPickerCmd } from '@/components/command/ModelPickerCmd'
import { ModelButton } from '@/components/composer/ModelButton'
import { Button, IconButton } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Panel, PanelHeader, PanelTitle } from '@/components/ui/Panel'
import { TextField } from '@/components/ui/TextField'
import { VScrollArea } from '@/components/ui/VScrollArea'
import { useOrderedListReducer } from '../hooks/useOrderedListReducer'
import {
  SamplePatternAvatar2,
  SamplePatternAvatar3,
  SamplePatternAvatar4,
  SamplePatternAvatar5,
} from './SampleAvatars'

import type { EMessage, EPattern } from '@/convex/types'
import type { ButtonProps } from '@radix-ui/themes'

const description = `Greg is a friendly and approachable LLM chat personality designed to assist users with a wide range of inquiries.`

const demo_patn: EPattern = {
  _id: '1' as any,
  _creationTime: 1,
  xid: '10skdp2k4p5',
  updatedAt: 1,
  lastUsedAt: 1,
  userId: '1' as any,
  name: 'Greg Pattern',
  description,
  model: {
    id: 'meta-llama/llama-3.1-70b-instruct',
  },
  instructions: getSampleInstructions(),
  initialMessages: getSampleInitialMessages().slice(0, 5),
  dynamicMessages: [],
  kvMetadata: {},
}

export default function Page() {
  const [resourceKey, setResourceKey] = useState('openrouter::' + demo_patn.model.id)
  // Replace useOrderedList with useOrderedListReducer
  const { items: initialMessages, updateItems: updateInitialMessages } = useOrderedListReducer(
    demo_patn.initialMessages.map((item, i) => ({ ...item, __key: demo_patn.xid + i })),
  )

  const addNewMessage = () => {
    const newMessage: EPattern['initialMessages'][number] & { __key: string } = {
      role: 'user',
      text: '',
      __key: demo_patn.xid + demo_patn.initialMessages.length,
    }
    updateInitialMessages({ type: 'insertEnd', item: newMessage })
  }

  const [ref] = useAutoAnimate()

  const panelCn = 'max-w-2xl'
  return (
    <>
      {/* => basic */}
      <Panel className={panelCn}>
        <PanelHeader className="pl-4">
          <PanelTitle href="/patterns">Pattern Configuration</PanelTitle>
        </PanelHeader>

        <VScrollArea>
          {/* > id/name/pic */}
          <div className="flex gap-3 p-4">
            <div className="flex grow flex-col justify-between">
              <div>
                <Label>Pattern ID</Label>
                <Code size="3">{demo_patn.xid}</Code>
              </div>

              <div>
                <Label>Name</Label>
                <TextField defaultValue={demo_patn.name} />
              </div>
            </div>

            {/* > avatar */}
            <div className="shrink-0">
              <div className="h-32 w-32 overflow-hidden rounded border bg-blackA-1">
                <SamplePatternAvatar4 className="h-full w-full" />
              </div>
            </div>
          </div>

          {/* > desc */}
          <div className="p-4">
            <Label>Description</Label>
            <ReactTextareaAutosize
              minRows={4}
              rows={4}
              maxRows={4}
              className="flex w-full resize-none rounded border border-grayA-3 bg-blackA-1 p-2 outline-none placeholder:text-grayA-8"
              defaultValue={demo_patn.description}
            />
          </div>

          {/* > model */}
          <div className="space-y-1 p-4">
            <Label>Model</Label>
            <ModelPickerCmd value={resourceKey} onValueChange={setResourceKey}>
              <ModelButton resourceKey={resourceKey} />
            </ModelPickerCmd>

            <div className="py-2">
              <Code color="gray" size="3">
                {resourceKey.split('::')[1]}
              </Code>
            </div>
          </div>

          <div className="space-y-1 p-4">
            <Label>Maximum Conversation Size</Label>
            <TextField type="number" className="w-16" placeholder="50" />
          </div>
        </VScrollArea>
      </Panel>

      {/* => instructions */}
      <Panel className={panelCn}>
        <PanelHeader className="pl-4">
          <PanelTitle href="/patterns">Instructions</PanelTitle>
        </PanelHeader>

        <ReactTextareaAutosize
          minRows={6}
          rows={6}
          className="flex w-full resize-none bg-blackA-3 p-4 outline-none placeholder:text-grayA-8"
          placeholder="You are a really very average assistant."
          defaultValue={demo_patn.instructions}
        />
      </Panel>

      {/* => initial messages */}
      <Panel className={panelCn}>
        <PanelHeader className="pl-4">
          <PanelTitle href="/patterns">Initial Messages</PanelTitle>
        </PanelHeader>

        <VScrollArea>
          <div ref={ref} className="space-y-4 p-4">
            {initialMessages.map(
              (message: EPattern['initialMessages'][number] & { __key: string }, index: number) => (
                <PatternMessage
                  key={message.__key}
                  message={message}
                  onMoveUp={() => updateInitialMessages({ type: 'moveUp', index })}
                  onMoveDown={() => updateInitialMessages({ type: 'moveDown', index })}
                  onDelete={() => updateInitialMessages({ type: 'remove', index })}
                  onUpdate={(updatedMessage) =>
                    updateInitialMessages({
                      type: 'update',
                      index,
                      updateFn: () => updatedMessage,
                    })
                  }
                />
              ),
            )}
            <Button variant="surface" onClick={addNewMessage} className="mx-auto flex">
              Add <Icons.Plus size={16} />
            </Button>
          </div>
        </VScrollArea>
      </Panel>
    </>
  )
}

function PatternMessage({
  message,
  onMoveUp,
  onMoveDown,
  onDelete,
  onUpdate,
}: {
  message: EPattern['initialMessages'][number] & { __key: string }
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
  onUpdate: (updatedMessage: EPattern['initialMessages'][number] & { __key: string }) => void
}) {
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...message, text: event.target.value })
  }

  const handleRoleChange = () => {
    const newRole =
      message.role === 'user' ? 'assistant' : message.role === 'assistant' ? 'system' : 'user'
    onUpdate({ ...message, role: newRole })
  }

  const handleNameChange = (input: string) => {
    onUpdate({ ...message, name: input })
  }

  const handleHiddenToggle = () => {
    onUpdate({ ...message, channel: message.channel === 'hidden' ? undefined : 'hidden' })
  }

  return (
    <div
      style={{ contain: 'paint' }}
      data-message-role={message.role}
      data-message-channel={message.channel}
      className="group flex shrink-0 flex-col overflow-hidden rounded border bg-gray-2 data-[message-channel=hidden]:opacity-60"
    >
      {/* > header */}
      <div className="flex-between shrink-0 items-center gap-1 border-b border-grayA-3 bg-grayA-2 px-2 py-1.5">
        <div className="flex-start w-20 gap-2">
          <RoleToggleButton role={message.role} onClick={handleRoleChange} />
        </div>

        <TextField
          variant="surface"
          value={message.name}
          onValueChange={handleNameChange}
          disabled={message.role === 'system'}
          placeholder="name"
          className="group-data-[message-role=system]:invisible"
        />

        <div className="flex-end gap-1">
          <IconButton size="1" variant="surface" aria-label="Move up" onClick={handleHiddenToggle}>
            {message.channel === 'hidden' ? <Icons.EyeClosed size={16} /> : <Icons.Eye size={16} />}
          </IconButton>
          <IconButton size="1" variant="surface" aria-label="Move up" onClick={onMoveUp}>
            <Icons.CaretUp size={16} />
          </IconButton>
          <IconButton size="1" variant="surface" aria-label="Move down" onClick={onMoveDown}>
            <Icons.CaretDown size={16} />
          </IconButton>
          <IconButton size="1" variant="surface" aria-label="Delete" color="red" onClick={onDelete}>
            <Icons.Trash size={16} />
          </IconButton>
        </div>
      </div>

      {/* > body */}
      <ReactTextareaAutosize
        minRows={1}
        rows={1}
        className="flex w-full resize-none rounded bg-blackA-1 p-2 outline-none placeholder:text-grayA-8"
        placeholder="(blank message)"
        value={message.text}
        onChange={handleTextChange}
      />
    </div>
  )
}

function RoleToggleButton({ role, onClick }: { role: EMessage['role']; onClick: () => void }) {
  const colors: Record<string, ButtonProps['color']> = {
    user: 'grass',
    assistant: 'orange',
    system: 'amber',
  }
  const color = colors[role] ?? 'gray'

  return (
    <Button variant="soft" size="1" color={color} className="font-mono uppercase" onClick={onClick}>
      {role}
    </Button>
  )
}

function getSampleInstructions() {
  return `1. **Be Friendly and Approachable**: Always maintain a warm and welcoming tone. Use language that is easy to understand and avoid overly technical jargon unless specifically requested by the user.

2. **Provide Clear and Concise Information**: Ensure that responses are straightforward and to the point, while still being informative. Break down complex topics into simpler concepts to aid user understanding.

3. **Engage with Users**: Encourage interaction by asking follow-up questions or offering additional information that might be relevant to the user's inquiry. Make the conversation feel dynamic and engaging.

4. **Incorporate Humor and Fun**: When appropriate, include light-hearted jokes, fun facts, or interesting anecdotes to make the interaction enjoyable. Balance professionalism with a playful touch.

5. **Be Supportive and Encouraging**: Foster a positive environment where users feel comfortable asking questions and exploring new topics. Offer encouragement and support to boost user confidence.

6. **Adapt to User Needs**: Tailor responses based on the user's level of expertise and specific needs. Be flexible and adjust your approach to suit different contexts and preferences.

7. **Ensure Privacy and Respect**: Always respect user privacy and avoid asking for or storing personal information. Maintain a respectful and considerate tone in all interactions.`
}

function getSampleInitialMessages() {
  return [
    { role: 'system', text: 'You are a helpful assistant.' },
    { role: 'user', name: 'example_user', text: 'Hello, how are you?' },
    { role: 'assistant', name: 'example_assistant', text: 'I am fine, thank you!' },
    {
      role: 'user',
      name: 'example_user',
      text: 'What is the capital of the moon?',
    },
    {
      role: 'assistant',
      name: 'example_assistant',
      text: 'The capital of the moon is called New Moon.',
    },
    { role: 'user', name: 'example_user', text: 'What is the capital of the sun?' },
    {
      role: 'assistant',
      name: 'example_assistant',
      text: 'The capital of the sun is called New Sun.',
    },
    { role: 'user', name: 'example_user', text: 'What is the capital of the earth?' },
    {
      role: 'assistant',
      name: 'example_assistant',
      text: 'The capital of the earth is called New Earth.',
    },
  ] as EPattern['initialMessages']
}
