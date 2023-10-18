import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { ChatModelOption } from '@/lib/api'
import { cn } from '@/lib/utils'
import { CrossCircledIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { useImmer } from 'use-immer'
import { ChatSession } from '../chat/types'
import { ModelsCombobox } from './models-combobox'

type Props = {
  session: ChatSession
  updateSession: (fn: (session: ChatSession) => void) => void
  modelsAvailable: ChatModelOption[]
}

export function InferenceParameterControls({ session, updateSession, modelsAvailable }: Props) {
  const { parameters, panel } = session

  const { frequency_penalty, presence_penalty, stream, max_tokens, n, temperature, top_p, stop } =
    parameters

  const max_tokensMax = 4097 // TODO

  // coerce to string[]
  const stopCurrent = Array.isArray(parameters.stop)
    ? parameters.stop
    : parameters.stop == null
    ? []
    : [parameters.stop]

  const [stopInputValue, setStopInputValue] = useState('')
  const handleStopInput = () => {
    if (!stopInputValue || stopCurrent.includes(stopInputValue)) return
    updateSession((s) => (s.parameters.stop = [...stopCurrent, stopInputValue]))
    setStopInputValue('')
  }

  return (
    <>
      <div className="text-center text-sm">
        Chat Inference Parameters - {session.id} {panel.title}
      </div>

      <div className="flex flex-wrap justify-center gap-2 px-2 py-1">
        <ModelsCombobox
          session={session}
          updateSession={updateSession}
          modelsAvailable={modelsAvailable}
        />

        <div className="flex items-center space-x-2 rounded-md border px-2">
          <Switch
            id="stream"
            checked={stream}
            onCheckedChange={(checked) => updateSession((s) => (s.parameters.stream = checked))}
          />
          <Label htmlFor="stream">Stream</Label>
        </div>

        <div className="flex items-center space-x-2 rounded-md border pl-2">
          <Switch disabled />
          <Label htmlFor="n">n</Label>
          <Input type="number" placeholder="1" className="w-14 px-1 text-right" disabled />
        </div>
      </div>

      {/* //* temperature */}
      <OptionalControl label="temperature" enabled={false}>
        <SliderInput
          id="temperature"
          min={0}
          max={2}
          step={0.01}
          value={temperature ?? 1}
          onChange={(v) => updateSession((s) => (s.parameters.temperature = v))}
          decimal={2}
        />
      </OptionalControl>

      {/* //* max_tokens */}
      <OptionalControl label="max_tokens" enabled={true}>
        <SliderInput
          id="max_tokens"
          min={1}
          max={max_tokensMax}
          step={1}
          value={max_tokens ?? max_tokensMax}
          onChange={(v) => updateSession((s) => (s.parameters.max_tokens = v))}
        />
      </OptionalControl>

      {/* //* frequency_penalty */}
      <OptionalControl label="frequency_penalty" enabled={true}>
        <SliderInput
          id="frequency_penalty"
          min={-2.0}
          max={2.0}
          step={0.01}
          value={frequency_penalty ?? 0}
          onChange={(v) => updateSession((s) => (s.parameters.frequency_penalty = v))}
          decimal={2}
        />
      </OptionalControl>

      {/* //* presence_penalty */}
      <OptionalControl label="presence_penalty" enabled={true}>
        <SliderInput
          id="presence_penalty"
          min={-2.0}
          max={2.0}
          step={0.01}
          value={presence_penalty ?? 0}
          onChange={(v) => updateSession((s) => (s.parameters.presence_penalty = v))}
          decimal={2}
        />
      </OptionalControl>

      {/* //* top_p */}
      <OptionalControl label="top_p" enabled={true}>
        <SliderInput
          id="top_p"
          min={0}
          max={2}
          step={0.01}
          value={top_p ?? 1}
          onChange={(v) => updateSession((s) => (s.parameters.top_p = v))}
          decimal={2}
        />
      </OptionalControl>

      {/* //* stop */}
      <OptionalControl label="stop" enabled={true} className="space-y-2">
        <div className="mt-1 flex w-full gap-2">
          <Input
            className="font-sans"
            id="add_stop"
            value={stopInputValue}
            onChange={(e) => setStopInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) handleStopInput()
            }}
          />
          <Button variant="outline" onClick={handleStopInput}>
            <PlusCircledIcon />
          </Button>
        </div>

        <div className="w-full space-y-1">
          {stopCurrent.map((v, i) => (
            <Badge
              className="ml-1 justify-between gap-1 pr-1 font-sans text-sm font-normal"
              key={v}
            >
              {v}
              <Button
                className="h-5 w-7"
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newStop = stopCurrent.filter((_, _i) => i !== _i)
                  updateSession((s) => (s.parameters.stop = newStop))
                }}
              >
                <CrossCircledIcon />
              </Button>
            </Badge>
          ))}
        </div>
      </OptionalControl>
    </>
  )
}

type OptionalControl = {
  label: string
  id?: string
  enabled: boolean
  children?: React.ReactNode
  className?: string
}

function OptionalControl({ label, enabled, children, className, ...props }: OptionalControl) {
  const id = props.id ?? label
  return (
    <div className={cn('flex w-full flex-col items-center px-2 py-1 font-mono', className)}>
      <div className="flex w-full items-center justify-start gap-3">
        <Switch checked={enabled} />
        <Label htmlFor={id}>{label}</Label>
      </div>
      <div className={cn('w-full', !enabled && 'opacity-50')}>{children}</div>
    </div>
  )
}

type SliderInputProps = {
  id: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number | undefined) => void
  decimal?: number
  disabled?: boolean
}
function SliderInput({
  id,
  min,
  max,
  step,
  decimal,
  disabled = false,
  ...props
}: SliderInputProps) {
  const valueNumber = props.value
  const valueFixed = decimal ? valueNumber.toFixed(decimal) : valueNumber

  const handleInputChange = (value: string | number | undefined) => {
    props.onChange(typeof value === 'undefined' ? value : Number(value))
  }

  return (
    <div className="flex w-full space-x-1">
      <Slider
        id={`${id}_slider`}
        min={min}
        max={max}
        step={step}
        value={[valueNumber]}
        onValueChange={([v]) => handleInputChange(v)}
        minStepsBetweenThumbs={step}
        disabled={disabled}
      />
      <Input
        className="w-20 px-1 text-right"
        id={id}
        type="number"
        min={min}
        max={max}
        step={step}
        value={valueFixed}
        onChange={(v) => handleInputChange(v.target.value)}
        disabled={disabled}
      />
    </div>
  )
}
