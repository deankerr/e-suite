import { cn } from '@/lib/utils'
import { Checkbox, NumberInput } from '@ark-ui/react'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import { Deck, useEditableCardContext } from './deck'

export function InferenceParametersCard({ className }: React.ComponentProps<'div'>) {
  const { isEditing } = useEditableCardContext()

  const parameters = [
    ['temperature', '1.00'],
    ['frequency_penalty', '1.00'],
    ['presence_penalty', '1.00'],
    ['top_p', '1.00'],
  ]

  return (
    <>
      <Deck.CardTitle>Parameters</Deck.CardTitle>
      <Deck.CardBody
        className={cn(
          'flex flex-col justify-center divide-y font-mono text-sm',
          isEditing && 'divide-transparent',
          className,
        )}
      >
        {parameters.map((p) => (
          <label key={p[0]} className="flex items-center py-1">
            <Check editable={isEditing} />
            <span className="grow px-4">{p[0]}</span>
            <NInput editable={isEditing} />
          </label>
        ))}

        <label className="flex items-center py-1">
          <Check editable={isEditing} />
          <span className="grow px-4">max_tokens</span>
          <NInput
            editable={isEditing}
            min={1}
            max={2047}
            step={1}
            formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
            defaultValue="300"
          />
        </label>

        <label className="flex items-center py-2">
          <Check editable={isEditing} />
          <span className="grow px-4">stop</span>
          <span className="px-2">todo</span>
        </label>
      </Deck.CardBody>
    </>
  )
}

function NInput({
  editable = true,
  className,
  ...props
}: { editable?: boolean } & React.ComponentPropsWithRef<typeof NumberInput.Root>) {
  return (
    <NumberInput.Root
      min={0}
      max={2}
      formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
      defaultValue="1.00"
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
