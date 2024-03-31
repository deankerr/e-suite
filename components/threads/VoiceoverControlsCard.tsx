import { forwardRef, useEffect, useState } from 'react'
import { Card, Heading, Select, TextFieldInput } from '@radix-ui/themes'
import { useMutation, useQuery } from 'convex/react'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { Button } from '../ui/Button'
import { Label } from '../ui/Label'

import type { ThreadHelpers } from './useThread'
import type { Message } from '@/convex/threads/threads'
import type { Collection } from '@/convex/types'
import type { Voice } from '@/convex/voices'
import type { ClassNameValue } from '@/lib/utils'

type VoiceoverControlsCardProps = {
  threadHelpers: ThreadHelpers
} & React.ComponentProps<typeof Card>

export const VoiceoverControlsCard = forwardRef<HTMLDivElement, VoiceoverControlsCardProps>(
  function VoiceoverControlsCard({ threadHelpers, className, ...props }, forwardedRef) {
    const voicesAvailableList = useQuery(api.voices.list)
    const voices = threadHelpers.voices

    const updateOpt = useMutation(api.threads.threads.update).withOptimisticUpdate(
      (localStore, { id, fields }) => {
        const existingThread = localStore.getQuery(api.threads.threads.get, { id })
        if (!existingThread) return

        localStore.setQuery(
          api.threads.threads.get,
          { id },
          {
            ...existingThread,
            ...fields,
          },
        )
      },
    )

    const handleUpdate = ({
      role,
      name,
      voiceRef,
    }: {
      role: Message['role']
      name?: string
      voiceRef: string
    }) => {
      const threadId = threadHelpers.thread?._id
      if (!threadId) return

      const newVoices = [
        ...voices.filter((voice) => {
          const rem = voice.role !== role && voice.name !== name
          console.log(voice.role, role, voice.name, name)
          return rem
        }),
        { role, name, voiceRef },
      ].filter((voice) => voice.voiceRef !== 'none')

      const send = async () => {
        try {
          await updateOpt({
            id: threadId,
            fields: {
              voices: newVoices,
            },
          })
        } catch (err) {
          console.error(err)
          toast.error('An error occurred while updating voices.')
        }
      }

      void send()
    }

    useEffect(() => console.table(voices), [voices])

    return (
      <Card size="1" {...props} ref={forwardedRef}>
        <div className={cn('space-y-3', className)}>
          <Heading size="1">Voiceovers</Heading>

          <div className="space-y-1">
            <div className="flex-between border-b">
              <div className="w-1/2 text-sm font-semibold">Role</div>
              <div className="w-1/2 text-sm font-semibold">Voice</div>
            </div>
            <div className="flex-between">
              <Label className="text-sm">AI</Label>
              <VoiceSelect
                voicesList={voicesAvailableList}
                value={voices.find((voice) => voice.role === 'assistant')?.voiceRef}
                onValueChange={(value) => handleUpdate({ role: 'assistant', voiceRef: value })}
              />
            </div>
            <div className="flex-between">
              <Label className="text-sm">User</Label>
              <VoiceSelect
                voicesList={voicesAvailableList}
                value={voices.find((voice) => voice.role === 'user' && !voice.name)?.voiceRef}
                onValueChange={(value) => handleUpdate({ role: 'user', voiceRef: value })}
              />
            </div>
            <div className="flex-between">
              <Label className="text-sm">System</Label>
              <VoiceSelect
                voicesList={voicesAvailableList}
                value={voices.find((voice) => voice.role === 'system')?.voiceRef}
                onValueChange={(value) => handleUpdate({ role: 'system', voiceRef: value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex-between border-b">
              <div className="w-1/2 text-sm font-semibold">Name</div>
              <div className="w-1/2 text-sm font-semibold">Voice</div>
            </div>
            {voices.map(({ role, name, voiceRef }) => {
              if (role !== 'user' || !name) return null
              return (
                <div key={name} className="flex-between">
                  <Label className="truncate text-sm">{name}</Label>
                  <VoiceSelect
                    voicesList={voicesAvailableList}
                    value={voiceRef}
                    onValueChange={(value) => handleUpdate({ role: 'user', name, voiceRef: value })}
                  />
                </div>
              )
            })}

            <NameVoiceInput
              voicesList={voicesAvailableList}
              onConfirm={(name, value) => handleUpdate({ role: 'user', name, voiceRef: value })}
            />
          </div>
        </div>
      </Card>
    )
  },
)

type NameVoiceInputProps = {
  voicesList?: Collection<Voice>
  onConfirm: (name: string, value: string) => void
} & React.ComponentProps<'div'>

export const NameVoiceInput = ({
  voicesList,
  onConfirm,
  className,
  ...props
}: NameVoiceInputProps) => {
  const [name, setName] = useState('')
  const [voiceRef, setVoiceRef] = useState('')

  return (
    <div {...props} className={cn('space-y-1 pt-1', className)}>
      <div className="flex-between gap-1 border-t pt-2">
        <TextFieldInput
          size={{
            initial: '3',
            md: '2',
          }}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <VoiceSelect
          size={{
            initial: '3',
            md: '2',
          }}
          voicesList={voicesList}
          value={voiceRef}
          onValueChange={setVoiceRef}
        />
      </div>
      <div className="flex-end text-sm font-semibold">
        <Button
          size="1"
          disabled={!name || !voiceRef}
          onClick={() => {
            onConfirm(name, voiceRef)
            setName('')
            setVoiceRef('')
          }}
        >
          Add
        </Button>
      </div>
    </div>
  )
}

type VoiceSelectProps = {
  voicesList?: Collection<Voice>
  className?: ClassNameValue
} & Partial<React.ComponentProps<typeof Select.Root>>

const VoiceSelect = ({ voicesList, className, ...props }: VoiceSelectProps) => {
  return (
    <Select.Root {...props}>
      <Select.Trigger placeholder="Voice" className={cn('w-1/2', className)} />
      <Select.Content>
        <Select.Item value="none">None</Select.Item>
        {voicesList?.map((item) =>
          'group' in item ? (
            <Select.Group key={item.id}>
              <Select.Label>{item.name}</Select.Label>
              {item.group.map((voice) => (
                <Select.Item key={voice.id} value={voice.id}>
                  {voice.name}
                </Select.Item>
              ))}
            </Select.Group>
          ) : (
            <Select.Item key={item.id} value={item.id}>
              {item.name}
            </Select.Item>
          ),
        )}
      </Select.Content>
    </Select.Root>
  )
}
