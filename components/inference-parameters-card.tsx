import { cn } from '@/lib/utils'
import { AgentDetail, AgentParametersRecord } from '@/schema-zod/zod-user'
import { Checkbox, NumberInput } from '@ark-ui/react'
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cross2Icon,
  PlusIcon,
} from '@radix-ui/react-icons'
import { useRef, useState } from 'react'
import { mapToObj } from 'remeda'
import { CancelButton, ConfirmButton, EditButton, LoadingButton } from './buttons'
import { Deck } from './deck'
import { useUpdateAgent } from './queries'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

export function InferenceParametersCard({
  agent,
  className,
}: { agent: AgentDetail } & React.ComponentProps<'div'>) {
  const updateAgent = useUpdateAgent(agent.id)
  const isPending = updateAgent.isPending
  const [isEditing, setIsEditing] = useState(false)

  const definitions = getEngineParametersAvailable(agent.engine.vendorId)
  const storedParameters = agent.engineParameters[agent.engineId] ?? {}

  const [currentParameters, setCurrentParameters] = useState({ ...storedParameters })
  const [currentChecked, setCurrentChecked] = useState(
    //* map existing values to boolean record
    mapToObj(definitions, (def) => [def.key, storedParameters[def.key] !== undefined]),
  )

  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  return (
    <>
      <Deck.CardToolbar>
        {isEditing ? (
          <>
            <CancelButton
              onClick={() => {
                setCurrentParameters({ ...storedParameters })
                setIsEditing(false)
              }}
            />
            <ConfirmButton
              onClick={() => {
                if (!isPending) {
                  //* create record of only checked parameter values
                  const parameters = mapToObj(definitions, (def) => [
                    def.key,
                    currentChecked[def.key] ? currentParameters[def.key] : undefined,
                  ])
                  const record = {
                    ...agent.engineParameters,
                    [agent.engineId]: parameters,
                  } as AgentParametersRecord
                  updateAgent.mutate({ parameters: record })
                }
                setIsEditing(false)
              }}
            />
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
        {definitions.map((def) => {
          if (def.type === 'number') {
            return (
              <div key={agent.id + def.key} className="flex items-center py-1">
                <Check
                  editable={isEditing}
                  checked={currentChecked[def.key]}
                  onCheckedChange={({ checked }) =>
                    setCurrentChecked({ ...currentChecked, [def.key]: checked })
                  }
                />
                <label className="grow px-4">{def.key}</label>
                <NumInput
                  editable={isEditing}
                  min={def.min}
                  max={def.max}
                  formatOptions={{
                    minimumFractionDigits: def.fractionDigits,
                    maximumFractionDigits: def.fractionDigits,
                  }}
                  step={def.step}
                  value={String(currentParameters[def.key] ?? def.default)}
                  onValueChange={({ valueAsNumber }) => {
                    setCurrentParameters({ ...currentParameters, [def.key]: valueAsNumber })
                    setCurrentChecked({ ...currentChecked, [def.key]: true })
                  }}
                />
              </div>
            )
          }

          if (def.type === 'list') {
            return (
              <div key={agent.id + def.key} className="mt-1 flex h-10 py-2">
                <Check
                  editable={isEditing}
                  checked={currentChecked[def.key]}
                  onCheckedChange={({ checked }) =>
                    setCurrentChecked({ ...currentChecked, [def.key]: Boolean(checked) })
                  }
                />
                <label className="grow px-4">{def.key}</label>
                {!isEditing && (
                  <div className="-mt-1 divide-y px-2">
                    {currentParameters[def.key]?.map((item) => (
                      <div key={agent.id + def.key + item} className="py-1">
                        {item}
                      </div>
                    ))}
                  </div>
                )}

                {isEditing && (
                  <div className="">
                    {currentParameters[def.key]?.map((item) => (
                      <div
                        key={agent.id + def.key + item}
                        className="flex w-full gap-3 pb-1 pl-2 pr-1"
                      >
                        <Textarea
                          className="h-10 resize-none py-2 disabled:opacity-90"
                          placeholder={item}
                          rows={1}
                          disabled
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="mt-0.5 shrink-0 rounded-full"
                          onClick={() => {
                            if (textAreaRef.current) {
                              const list = currentParameters[def.key] ?? []
                              setCurrentParameters({
                                ...currentParameters,
                                [def.key]: list.filter((listItem) => listItem !== item),
                              })
                              setCurrentChecked({ ...currentChecked, [def.key]: true })
                            }
                          }}
                        >
                          <Cross2Icon className="h-5 w-5 text-foreground/80" />
                        </Button>
                      </div>
                    ))}

                    <div className="flex w-full gap-3 pl-2 pr-1">
                      <Textarea className="h-10 resize-none py-2" rows={1} ref={textAreaRef} />
                      <Button
                        variant="outline"
                        size="icon"
                        className="mt-0.5 shrink-0 rounded-full"
                        onClick={() => {
                          if (textAreaRef.current) {
                            if (textAreaRef.current.value === '') return
                            const list = currentParameters[def.key] ?? []
                            setCurrentParameters({
                              ...currentParameters,
                              [def.key]: [...list, textAreaRef.current.value],
                            })
                            setCurrentChecked({ ...currentChecked, [def.key]: true })
                            textAreaRef.current.value = ''
                          }
                        }}
                      >
                        <PlusIcon className="h-5 w-5 text-foreground/80" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          }

          if (def.type === 'string') {
            return (
              <div key={agent.id + def.key} className="flex items-center py-2">
                <Check
                  editable={isEditing}
                  checked={currentChecked[def.key]}
                  onCheckedChange={({ checked }) =>
                    setCurrentChecked({ ...currentChecked, [def.key]: Boolean(checked) })
                  }
                />
                <label className="grow px-4">{def.key}</label>
                {isEditing ? (
                  <Input
                    value={currentParameters[def.key]}
                    onChange={(e) => {
                      setCurrentParameters({ ...currentParameters, [def.key]: e.target.value })
                      setCurrentChecked({ ...currentChecked, [def.key]: true })
                    }}
                  />
                ) : (
                  <span className="px-2">{currentParameters[def.key]}</span>
                )}
              </div>
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
    <Checkbox.Root {...props} disabled={!editable}>
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

type ParameterKey = keyof typeof parameterDefinitions
type EngineParametersList = ParameterKey[]

const openaiParameters: EngineParametersList = [
  'temperature',
  'max_tokens',
  'frequency_penalty',
  'presence_penalty',
  'top_p',
  'stop',
]
const openrouterParameters: EngineParametersList = [
  'temperature',
  'max_tokens',
  'frequency_penalty',
  'presence_penalty',
  'top_p',
  'stop',
]
const togetheraiParameters: EngineParametersList = [
  'temperature',
  'max_tokens',
  'repetition_penalty',
  'top_p',
  'stop_token',
]

function getEngineParametersAvailable(vendorId: string) {
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
