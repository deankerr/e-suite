import { forwardRef } from 'react'
import { Card, Heading, Select } from '@radix-ui/themes'
import { useQuery } from 'convex/react'

import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { Label } from '../ui/Label'

type VoiceItem = {
  label: string
  value: string
}

type VoiceList = Array<
  | {
      label: string
      group: VoiceItem[]
    }
  | VoiceItem
>

type VoiceoverControlsCardProps = {} & React.ComponentProps<typeof Card>

export const VoiceoverControlsCard = forwardRef<HTMLDivElement, VoiceoverControlsCardProps>(
  function VoiceoverControlsCard({ className, ...props }, forwardedRef) {
    const voices = useQuery(api.voices.list)

    const voicesList: VoiceList = voices
      ? [
          { label: 'None', value: 'none' },
          {
            label: 'Amazon Polly',
            group: voices?.aws.map((voice) => ({
              label: `${voice.name} (${voice.language})`,
              value: `aws_${voice.id}`,
            })),
          },
          {
            label: 'ElevenLabs',
            group: voices?.elevenlabs.map((voice) => ({
              label: `${voice.name} (${voice.language})`,
              value: `elabs_${voice.id}`,
            })),
          },
        ]
      : []

    return (
      <Card size="1" {...props} ref={forwardedRef}>
        <div className={cn('space-y-2', className)}>
          <Heading size="1">Voiceover</Heading>

          <div className="space-y-1">
            <div className="flex-between mb-2 border-b">
              <Label className="w-1/2 text-center">Role / Name</Label>
              <Label className="w-1/2 text-center">Voice</Label>
            </div>
            <div className="flex-between">
              <Label className="text-sm">System</Label>
              <VoiceSelect voicesList={voicesList} />
            </div>
            <div className="flex-between">
              <Label className="text-sm">AI</Label>
              <VoiceSelect voicesList={voicesList} />
            </div>
            <div className="flex-between">
              <Label className="text-sm">User</Label>
              <VoiceSelect voicesList={voicesList} />
            </div>

            <div className="flex-between">
              <Label className="text-sm">William Taylor</Label>
              <VoiceSelect voicesList={voicesList} />
            </div>

            <div className="flex-between">
              <Label className="text-sm">Ava Hernandez</Label>
              <VoiceSelect voicesList={voicesList} />
            </div>

            <div className="flex-between">
              <Label className="text-sm">Isabella Rodriguez</Label>
              <VoiceSelect voicesList={voicesList} />
            </div>
          </div>
        </div>
      </Card>
    )
  },
)

type VoiceSelectProps = {
  voicesList?: VoiceList
} & Partial<React.ComponentProps<typeof Select.Root>>

export const VoiceSelect = ({ voicesList, ...props }: VoiceSelectProps) => {
  // VoiceSelect
  return (
    <Select.Root size="2" {...props}>
      <Select.Trigger placeholder="Select voice" className="w-1/2" />
      <Select.Content>
        {voicesList?.map((item) =>
          'group' in item ? (
            <>
              <Select.Separator />
              <Select.Group key={item.label}>
                <Select.Label>{item.label}</Select.Label>
                {item.group.map((voice) => (
                  <Select.Item key={voice.value} value={voice.value}>
                    {voice.label}
                  </Select.Item>
                ))}
              </Select.Group>
            </>
          ) : (
            <Select.Item key={item.value} value={item.value}>
              {item.label}
            </Select.Item>
          ),
        )}
      </Select.Content>
    </Select.Root>
  )
}
