import { forwardRef, useEffect, useState } from 'react'
import { Card, Heading, Select, TextFieldInput } from '@radix-ui/themes'
import { useMutation, useQuery } from 'convex/react'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { Button } from '../ui/Button'
import { Label } from '../ui/Label'

import type { ThreadHelpers } from './useThread'
import type { Collection } from '@/convex/types'
import type { Voice } from '@/convex/voices'
import type { ClassNameValue } from '@/lib/utils'

type VoiceoverControlsCardProps = {
  threadHelpers: ThreadHelpers
} & React.ComponentProps<typeof Card>

export const VoiceoverControlsCard = forwardRef<HTMLDivElement, VoiceoverControlsCardProps>(
  function VoiceoverControlsCard({ threadHelpers, className, ...props }, forwardedRef) {
    const voicesList = useQuery(api.voices.list)

    const threadVoices = threadHelpers.voices
    const [currentVoices, setCurrentVoices] = useState(threadVoices)

    const update = useMutation(api.threads.threads.update)

    const handleUpdate = () => {
      async function send() {
        const id = threadHelpers.thread?._id
        if (!id) return
        try {
          await update({
            id,
            fields: {
              voices: currentVoices.filter((v) => v.voiceRef !== 'remove'),
            },
          })
          toast.success('Voices updated.')
        } catch (err) {
          console.error(err)
          toast.error('Voices update failed.')
        }
      }
      void send()
    }

    useEffect(() => {
      setCurrentVoices(threadVoices)
    }, [threadVoices])

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
                voicesList={voicesList}
                value={currentVoices.find((v) => v.role === 'assistant')?.voiceRef}
                onValueChange={(value) => {
                  setCurrentVoices((prev) => [
                    ...prev.filter((v) => v.role !== 'assistant'),
                    { role: 'assistant', voiceRef: value },
                  ])
                }}
              />
            </div>
            <div className="flex-between">
              <Label className="text-sm">User</Label>
              <VoiceSelect
                voicesList={voicesList}
                value={currentVoices.find((v) => v.role === 'user' && !v.name)?.voiceRef}
                onValueChange={(value) => {
                  setCurrentVoices((prev) => [
                    ...prev.filter((v) => v.role !== 'user'),
                    { role: 'user', voiceRef: value },
                  ])
                }}
              />
            </div>
            <div className="flex-between">
              <Label className="text-sm">System</Label>
              <VoiceSelect
                voicesList={voicesList}
                value={currentVoices.find((v) => v.role === 'system')?.voiceRef}
                onValueChange={(value) => {
                  setCurrentVoices((prev) => [
                    ...prev.filter((v) => v.role !== 'system'),
                    { role: 'system', voiceRef: value },
                  ])
                }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex-between border-b">
              <div className="w-1/2 text-sm font-semibold">Name</div>
              <div className="w-1/2 text-sm font-semibold">Voice</div>
            </div>
            {currentVoices.map(({ role, name, voiceRef }) => {
              if (role !== 'user' || !name) return null
              return (
                <div key={`${name}|${voiceRef}`} className="flex-between">
                  <Label className="text-sm">{name}</Label>
                  <VoiceSelect
                    voicesList={voicesList}
                    value={voiceRef}
                    onValueChange={(value) =>
                      setCurrentVoices((prev) => [
                        ...prev.filter((v) => v.name !== name),
                        { role: 'user', name, voiceRef: value },
                      ])
                    }
                  />
                </div>
              )
            })}

            <NameVoiceInput
              voicesList={voicesList}
              onConfirm={(name, voiceRef) => {
                setCurrentVoices((prev) => [
                  ...prev.filter((v) => v.name !== name),
                  { role: 'user', name, voiceRef },
                ])
              }}
            />
          </div>
        </div>

        {threadVoices !== currentVoices && (
          <div className="absolute right-2 top-2">
            <Button variant="surface" size="1" onClick={handleUpdate}>
              Confirm
            </Button>
          </div>
        )}
      </Card>
    )
  },
)

type NameVoiceInputProps = {
  voicesList?: Collection<Voice>
  onConfirm: (name: string, voiceRef: string) => void
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
        <Select.Item value="remove">None</Select.Item>
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
