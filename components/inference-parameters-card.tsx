import { cn } from '@/lib/utils'
import { AgentDetail } from '@/schema/user'
import { Checkbox, NumberInput } from '@ark-ui/react'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { CancelButton, ConfirmButton, EditButton, LoadingButton } from './buttons'
import { Deck } from './deck'

export function InferenceParametersCard({
  agent,
  className,
}: { agent: AgentDetail } & React.ComponentProps<'div'>) {
  const [isEditing, setIsEditing] = useState(false)

  const isPending = false
  const parameters = getParametersForVendor(agent.engine.providerId)

  return (
    <>
      <Deck.CardToolbar>
        {isEditing ? (
          <>
            <CancelButton onClick={() => setIsEditing(false)} />
            <ConfirmButton onClick={() => setIsEditing(false)} />
          </>
        ) : isPending ? (
          <LoadingButton />
        ) : (
          <EditButton onClick={() => setIsEditing(true)} />
        )}
      </Deck.CardToolbar>

      <Deck.CardTitle>Parameters</Deck.CardTitle>

      <Deck.CardBody
        className={cn(
          'flex flex-col justify-center space-y-0 divide-y font-mono text-sm',
          isEditing && 'divide-transparent',
          className,
        )}
      >
        {parameters.map((def) => {
          if (def.type === 'number') {
            return (
              <label key={def.key} className="flex items-center py-1">
                <Check editable={isEditing} />
                <span className="grow px-4">{def.key}</span>
                <NumInput
                  editable={isEditing}
                  min={def.min}
                  max={def.max}
                  formatOptions={{
                    minimumFractionDigits: def.fractionDigits,
                    maximumFractionDigits: def.fractionDigits,
                  }}
                  step={def.step}
                  defaultValue={String(def.default)}
                />
              </label>
            )
          }

          if (def.type === 'list') {
            return (
              <label key={def.key} className="flex items-center py-2">
                <Check editable={isEditing} />
                <span className="grow px-4">{def.key}</span>
                <span className="px-2">todo list</span>
              </label>
            )
          }

          if (def.type === 'string') {
            return (
              <label key={def.key} className="flex items-center py-2">
                <Check editable={isEditing} />
                <span className="grow px-4">{def.key}</span>
                <span className="px-2">todo string</span>
              </label>
            )
          }
        })}
      </Deck.CardBody>
    </>
  )
}

function NumInput({
  editable = true,
  className,
  ...props
}: { editable?: boolean } & React.ComponentPropsWithRef<typeof NumberInput.Root>) {
  return (
    <NumberInput.Root
      min={0}
      max={2}
      formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
      defaultValue="1"
      step={0.1}
      allowMouseWheel={true}
      className={cn(
        'box-content flex w-24 rounded-md border border-transparent',
        editable && 'border-input shadow-sm',
        className,
      )}
      {...props}
    >
      <NumberInput.Control className={cn('grid', !editable && 'pointer-events-none opacity-0')}>
        <NumberInput.IncrementTrigger
          className={cn('border-b border-transparent px-2', editable && 'border-input')}
        >
          <ChevronUpIcon />
        </NumberInput.IncrementTrigger>
        <NumberInput.DecrementTrigger className={cn('px-2')}>
          <ChevronDownIcon />
        </NumberInput.DecrementTrigger>
      </NumberInput.Control>
      <NumberInput.Input
        disabled={!editable}
        className={cn(
          'flex h-8 w-full items-center bg-transparent px-2 py-0 text-right text-sm leading-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          editable ? 'border-l border-input' : '',
        )}
      />
    </NumberInput.Root>
  )
}

function Check({
  editable = true,
  ...props
}: { editable?: boolean } & React.ComponentPropsWithRef<typeof Checkbox.Root>) {
  return (
    <Checkbox.Root defaultChecked {...props} disabled={!editable}>
      <Checkbox.Control
        className={cn(
          'grid h-5 w-5 place-content-center rounded-sm border border-input shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          editable
            ? 'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground'
            : 'data-[state=checked]:bg-transparent data-[state=checked]:text-foreground/40',
        )}
      >
        <Checkbox.Indicator>
          <CheckIcon className="h-5 w-5" />
        </Checkbox.Indicator>
      </Checkbox.Control>
    </Checkbox.Root>
  )
}

const parameterDefinitions = {
  temperature: {
    key: 'temperature',
    type: 'number',
    min: 0,
    max: 2,
    fractionDigits: 2,
    step: 0.1,
    default: 1,
  },
  frequency_penalty: {
    key: 'frequency_penalty',
    type: 'number',
    min: -2,
    max: 2,
    fractionDigits: 2,
    step: 0.1,
    default: 0,
  },
  presence_penalty: {
    key: 'presence_penalty',
    type: 'number',
    min: -2,
    max: 2,
    fractionDigits: 2,
    step: 0.1,
    default: 0,
  },
  repetition_penalty: {
    key: 'repetition_penalty',
    type: 'number',
    min: 1,
    max: 2,
    fractionDigits: 2,
    step: 0.1,
    default: 1,
  },
  top_p: {
    key: 'top_p',
    type: 'number',
    min: 0,
    max: 1,
    fractionDigits: 2,
    step: 0.1,
    default: 1,
  },
  top_k: {
    key: 'top_k',
    type: 'number',
    min: 1,
    max: 100,
    fractionDigits: 0,
    step: 1,
    default: 1,
  },
  max_tokens: {
    key: 'max_tokens',
    type: 'number',
    min: 1,
    max: 2048, // TODO model maxes
    fractionDigits: 0,
    step: 1,
    default: 2048,
  },
  stop: {
    key: 'stop',
    type: 'list',
    max: 4, // TODO model maxes
  },
  stop_token: {
    key: 'stop_token',
    type: 'string',
  },
} as const

type ModelParametersList = Array<keyof typeof parameterDefinitions>

const openaiParameters: ModelParametersList = [
  'temperature',
  'max_tokens',
  'frequency_penalty',
  'presence_penalty',
  'top_p',
  'stop',
]
const openrouterParameters: ModelParametersList = [
  'temperature',
  'max_tokens',
  'frequency_penalty',
  'presence_penalty',
  'top_p',
  'stop',
]
const togetheraiParameters: ModelParametersList = [
  'temperature',
  'max_tokens',
  'repetition_penalty',
  'top_p',
  'stop_token',
]

function getParametersForVendor(vendorId: string) {
  switch (vendorId) {
    case 'openai':
      return openaiParameters.map((key) => parameterDefinitions[key])
    case 'openrouter':
      return openrouterParameters.map((key) => parameterDefinitions[key])
    case 'togetherai':
      return togetheraiParameters.map((key) => parameterDefinitions[key])
    default:
      throw new Error('invalid vendorId')
  }
}
