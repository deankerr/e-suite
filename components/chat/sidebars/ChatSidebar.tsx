import { useState } from 'react'
import { Badge, Button, Tabs } from '@radix-ui/themes'
import { ChevronsUpDownIcon } from 'lucide-react'

import { useChat } from '@/components/chat/ChatProvider'
import { BasicTextArea } from '@/components/form/BasicTextArea'
import { SliderWithInput } from '@/components/form/SliderWithInput'
import { ModelPicker } from '@/components/model-picker/ModelPicker'
import { TextareaAutosize } from '@/components/ui/TextareaAutosize'
import { useChatModels, useViewerDetails } from '@/lib/queries'
import { cn } from '@/lib/utils'

import type { ChatCompletionConfig, EChatModel, EThread } from '@/convex/types'

export const ChatSidebar = ({
  thread,
  config,
}: {
  thread: EThread
  config: ChatCompletionConfig
}) => {
  const { updateThread } = useChat()
  const { isOwner } = useViewerDetails(thread?.userId)

  const chatModels = useChatModels()
  const model = chatModels?.find((model) => model.resourceKey === config.resourceKey)

  const [showModelPicker, setShowModelPicker] = useState(false)
  const [instructionText, setInstructionText] = useState(thread.instructions)
  const isInstructionDirty = instructionText !== thread.instructions

  return (
    <div className="flex h-full flex-col overflow-hidden p-1">
      <Tabs.Root defaultValue="model">
        <Tabs.List>
          <Tabs.Trigger value="model">Model</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="model">
          <div className="p-2">
            <button
              className={cn(
                'mx-auto flex min-h-28 w-full flex-col items-start gap-1 rounded border border-grayA-3 px-3 py-3 text-start hover:bg-grayA-2',
                !isOwner && 'pointer-events-none',
              )}
              onClick={() => setShowModelPicker(!showModelPicker)}
            >
              {model ? (
                <>
                  <div className="line-clamp-2 shrink-0">{model.name}</div>
                  <div className="w-full grow font-mono text-xs text-gray-11">
                    {model.endpointModelId}
                  </div>
                  <div>
                    <Badge size="1" color="gray" className="shrink-0">
                      {model.endpoint}
                    </Badge>
                  </div>
                </>
              ) : (
                <div className="text-lg font-medium">Select Model</div>
              )}

              <div className="absolute inset-y-0 right-0 flex px-2">
                <ChevronsUpDownIcon className="m-auto" />
              </div>
            </button>

            {showModelPicker && chatModels && (
              <ModelPicker
                models={chatModels}
                onSelect={(model) => {
                  void updateThread({
                    inference: {
                      ...thread.inference,
                      resourceKey: model.resourceKey,
                      endpoint: model.endpoint,
                      endpointModelId: model.endpointModelId,
                    },
                  })
                  setShowModelPicker(false)
                }}
              />
            )}
          </div>

          <div className={cn('p-2', showModelPicker && 'hidden')}>
            <div className="text-sm font-medium">Instructions</div>
            <TextareaAutosize
              minRows={4}
              rows={4}
              maxRows={10}
              placeholder="System message..."
              value={instructionText}
              onValueChange={setInstructionText}
              disabled={!isOwner}
            />
            <div className="mt-2 gap-2 flex-end">
              <Button
                color="gray"
                disabled={!isInstructionDirty || !isOwner}
                onClick={() => setInstructionText(thread.instructions)}
              >
                Revert
              </Button>
              <Button
                disabled={!isInstructionDirty || !isOwner}
                onClick={() => {
                  void updateThread({ instructions: instructionText })
                }}
              >
                Save
              </Button>
            </div>
          </div>

          {model && !showModelPicker && <ParameterControls model={model} />}
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}

const ParameterControls = ({ model }: { model: EChatModel }) => {
  const parameters = getModelParams(model)
  return (
    <div className="hidden rounded p-2">
      <div className={cn('grid gap-6 border border-grayA-3 p-4')}>
        <SliderWithInput
          label="Max Tokens"
          defaultValue={
            defaultMaxTokens > model.contextLength ? model.contextLength : defaultMaxTokens
          }
          min={1}
          max={model.contextLength || defaultMaxTokens}
          step={1}
          disabled
        />

        {parameters.map((param) => (
          <SliderWithInput
            key={param.id}
            label={param.label}
            min={param.min}
            max={param.max}
            step={param.step}
            defaultValue={param.defaultValue}
            disabled
          />
        ))}

        <BasicTextArea
          label="Stop Sequences"
          rows={2}
          defaultValue={model.stop.join(', ')}
          disabled
        />
      </div>
    </div>
  )
}

const chatCompletionParameters = [
  {
    id: 'temperature',
    label: 'Temperature',
    defaultValue: 1,
    min: 0,
    max: 1,
    step: 0.01,
    type: 'number',
  },
  {
    id: 'top_p',
    label: 'Top P',
    defaultValue: 1,
    min: 0,
    max: 1,
    step: 0.01,
    type: 'number',
  },
  {
    id: 'top_k',
    label: 'Top K',
    defaultValue: 0,
    min: 0,
    max: 100,
    step: 1,
    type: 'number',
  },
  {
    id: 'repetition_penalty',
    label: 'Repetition Penalty',
    defaultValue: 1,
    min: 1,
    max: 2,
    step: 0.01,
    type: 'number',
  },
  {
    id: 'frequency_penalty',
    label: 'Frequency Penalty',
    defaultValue: 0,
    min: -2,
    max: 2,
    step: 0.01,
    type: 'number',
  },
  {
    id: 'presence_penalty',
    label: 'Presence Penalty',
    defaultValue: 0,
    min: -2,
    max: 2,
    step: 0.01,
    type: 'number',
  },
]

const getModelParams = (model: EChatModel) => {
  if (model.creatorName.toLowerCase() === 'openai') {
    return chatCompletionParameters.filter(
      (param) => !['top_k', 'repetition_penalty'].includes(param.id),
    )
  }
  return chatCompletionParameters.filter(
    (param) => !['frequency_penalty', 'presence_penalty'].includes(param.id),
  )
}

const defaultMaxTokens = 2048
