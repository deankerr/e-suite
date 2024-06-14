import { ChatModelCard } from '@/components/cards/ChatModelCard'
import { ImageModelCard } from '@/components/cards/ImageModelCard'
import { useChat } from '@/components/chat/ChatProvider'
import { BasicTextArea } from '@/components/form/BasicTextArea'
import { SliderWithInput } from '@/components/form/SliderWithInput'
import { useChatModels, useImageModels } from '@/lib/queries'
import { cn, getThreadConfig } from '@/lib/utils'

import type { EChatModel } from '@/convex/shared/shape'
import type { EChatCompletionInference } from '@/convex/shared/structures'
import type { EThread } from '@/convex/shared/types'

export const ChatSidebar = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { thread } = useChat()
  const config = getThreadConfig(thread)

  const chatCompletion = config.chatCompletion
  const chatModels = useChatModels()
  const chatModel =
    thread && chatModels.isSuccess
      ? chatModels.data.find(
          (model) =>
            model.model === config.chatCompletion?.model &&
            model.endpoint === config.chatCompletion.endpoint,
        )
      : undefined

  const imageModels = useImageModels()
  const imageModel =
    thread && imageModels.isSuccess
      ? imageModels.data.find(
          (model) =>
            model.model === config.textToImage?.model &&
            model.endpoint === config.textToImage.endpoint,
        )
      : undefined

  return (
    <div {...props} className={cn('h-full w-80 shrink-0 border-r border-grayA-3 p-4', className)}>
      {thread && chatCompletion && chatModel && (
        <ChatCompletionParameters
          key={chatModel.slug}
          thread={thread}
          config={chatCompletion}
          model={chatModel}
        />
      )}
      {imageModel && <ImageModelCard model={imageModel} className="mx-auto" />}
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

const defaultMaxTokens = 4095

const ChatCompletionParameters = ({
  model,
}: {
  thread: EThread
  config: EChatCompletionInference
  model: EChatModel
}) => {
  const parameters = getModelParams(model)

  return (
    <div className="flex flex-col gap-2">
      <ChatModelCard model={model} className="mx-auto" />

      <div className="grid gap-6 px-2">
        <SliderWithInput
          label="Max Tokens"
          defaultValue={
            defaultMaxTokens > model.contextLength ? model.contextLength : defaultMaxTokens
          }
          min={1}
          max={model.contextLength || defaultMaxTokens}
          step={1}
        />

        {parameters.map((param) => (
          <SliderWithInput
            key={param.id}
            label={param.label}
            min={param.min}
            max={param.max}
            step={param.step}
            defaultValue={param.defaultValue}
          />
        ))}

        <BasicTextArea label="Stop Sequences" rows={2} defaultValue={model.stop.join(', ')} />
      </div>
    </div>
  )
}
