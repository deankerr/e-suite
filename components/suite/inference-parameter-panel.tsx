import { PlatformKeys, schemas } from '@/lib/api/schemas'
import { cn } from '@/lib/utils'
import { SliderInput } from '../chat/form/slider-input'
import { TagInput } from '../chat/form/tag-input'
import { Loading } from '../ui/loading'
import { Switch } from '../ui/switch'
import { useAgentParametersMutation, useAgentQuery, useEngineQuery, useTabs } from './queries'

const labelClass = 'font-mono text-sm'

export function InferenceParameterPanel({ className }: React.ComponentProps<'div'>) {
  const { focusedTab } = useTabs()
  const { data: agent } = useAgentQuery(focusedTab?.agentId)
  const { data: engine } = useEngineQuery(agent?.engineId)
  const agentParametersMutation = useAgentParametersMutation()

  if (!agent || !engine)
    return (
      <div className={cn('space-y-8 p-4 text-center', className)}>
        <Loading />
      </div>
    )

  const current = agent.parameters[engine.id]

  const parameters = {
    ...defaultValues,
    ...current,
  }

  type Parameter = typeof parameters
  const parameterKeys = Object.keys(parameters)
  const schemaKeys = schemas[engine.providerId as PlatformKeys].chat.input.keyof()
    .options as string[]

  const setParameter = <T extends keyof Parameter>(
    key: T,
    enabled: boolean,
    value?: Parameter[T],
  ) => {
    const fieldsEnabled = parameters.fieldsEnabled.filter((field) => field !== key)
    if (enabled) {
      fieldsEnabled.push(key)
    }
    const newParameters = { ...parameters, fieldsEnabled }
    if (value) newParameters[key] = value

    agentParametersMutation.mutate({ agentId: agent.id, merge: { [engine.id]: newParameters } })
  }

  return (
    <div className={cn('space-y-8 p-4', className)}>
      {sliderInputKeys.map((key) => {
        if (parameterKeys.includes(key) && schemaKeys.includes(key)) {
          return (
            <div key={key}>
              <div className={labelClass}>
                <Switch
                  checked={parameters.fieldsEnabled.includes(key)}
                  onCheckedChange={(enabled) => setParameter(key, enabled)}
                />{' '}
                {key}
              </div>
              <SliderInput
                value={parameters[key]}
                onChange={(value) => setParameter(key, true, value)}
                range={sliderInputData[key]}
              />
            </div>
          )
        }
      })}

      {tagInputKeys.map((key) => {
        if (parameterKeys.includes(key) && schemaKeys.includes(key)) {
          return (
            <div key={key} className="grid grid-cols-[auto_1fr] items-center gap-x-2">
              <div className={labelClass}>
                <Switch
                  checked={parameters.fieldsEnabled.includes(key)}
                  onCheckedChange={(enabled) => setParameter(key, enabled)}
                />{' '}
                {key}
              </div>
              <TagInput
                values={parameters[key]}
                onChange={(value) => setParameter(key, true, value)}
              />
            </div>
          )
        }
      })}
    </div>
  )
}

const sliderInputData = {
  temperature: {
    min: 0,
    max: 2,
    step: 0.01,
    default: 1,
  },
  max_tokens: {
    min: 1,
    max: 4321,
    step: 1,
    default: 1234,
  },
  frequency_penalty: {
    min: -2,
    max: 2,
    step: 0.01,
    default: 0,
  },
  presence_penalty: {
    min: -2,
    max: 2,
    step: 0.01,
    default: 0,
  },
  repetition_penalty: {
    min: -2,
    max: 2,
    step: 0.01,
    default: 0,
  },
  top_p: {
    min: 0,
    max: 2,
    step: 0.01,
    default: 1,
  },
  top_k: {
    min: 0,
    max: 2,
    step: 0.01,
    default: 1,
  },
} as const
const sliderInputKeys = Object.keys(sliderInputData) as Array<keyof typeof sliderInputData>

// maximums
const tagInputData = {
  stop: 4,
  stop_token: 1,
}
const tagInputKeys = Object.keys(tagInputData) as Array<keyof typeof tagInputData>

const defaultValues = {
  fieldsEnabled: [],
  temperature: 1,
  max_tokens: 1234,
  frequency_penalty: 0,
  presence_penalty: 0,
  repetition_penalty: 0,
  top_p: 1,
  top_k: 1,
  stop: [],
  stop_token: [],
}
