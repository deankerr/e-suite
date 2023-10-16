import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { ChatModelOption } from '@/lib/api'
import { CrossCircledIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { ModelsCombobox } from './models-combobox'
import { ChatSession } from './types'

type Props = {
  session: ChatSession
  updateSession: (fn: (session: ChatSession) => void) => void
  modelsAvailable: ChatModelOption[]
}

export function ModelConfigPanel({ session, updateSession, modelsAvailable }: Props) {
  const { parameters, panel } = session

  const { frequency_penalty, presence_penalty, stream, max_tokens, n, temperature, top_p } =
    parameters

  const max_tokensMax = 4097 // TODO

  // coerce to string[]
  const stop = Array.isArray(parameters.stop)
    ? parameters.stop
    : parameters.stop == null
    ? []
    : [parameters.stop]

  const [stopInputValue, setStopInputValue] = useState('')
  const handleStopInput = () => {
    if (!stopInputValue || stop.includes(stopInputValue)) return
    updateSession((s) => (s.parameters.stop = [...stop, stopInputValue]))
    setStopInputValue('')
  }

  return (
    <div className="w-full space-y-2 bg-muted p-2">
      <div className="text-center text-sm">
        ModelConfigPanel - {session.id} {panel.title}
      </div>

      <ModelsCombobox
        session={session}
        updateSession={updateSession}
        modelsAvailable={modelsAvailable}
      />

      <div className="flex items-center space-x-2">
        <Label htmlFor="stream">Stream</Label>
        <Switch
          id="stream"
          checked={stream}
          onCheckedChange={(checked) => updateSession((s) => (s.parameters.stream = checked))}
        />
      </div>

      {/* // TODO n */}
      <SliderInput
        label="n"
        min={1}
        max={10}
        step={1}
        value={n ?? 1}
        onChange={(v) => updateSession((s) => (s.parameters.n = v))}
      />

      {/* //* frequency_penalty */}
      <SliderInput
        label="frequency_penalty"
        min={-2.0}
        max={2.0}
        step={0.01}
        value={frequency_penalty ?? 0}
        onChange={(v) => updateSession((s) => (s.parameters.frequency_penalty = v))}
        decimal={2}
      />

      {/* //* presence_penalty */}
      <SliderInput
        label="presence_penalty"
        min={-2.0}
        max={2.0}
        step={0.01}
        value={presence_penalty ?? 0}
        onChange={(v) => updateSession((s) => (s.parameters.presence_penalty = v))}
        decimal={2}
      />

      {/* //* max_tokens */}
      <SliderInput
        label="max_tokens"
        min={1}
        max={max_tokensMax}
        step={1}
        value={max_tokens ?? max_tokensMax}
        onChange={(v) => updateSession((s) => (s.parameters.max_tokens = v))}
      />

      {/* //* stop */}
      <div className="flex w-full flex-col items-center font-mono">
        <Label htmlFor="stop">stop</Label>

        {/* //* input */}
        <div className="flex gap-2 px-3 py-2">
          <Input
            className="font-sans"
            id="add_stop"
            value={stopInputValue}
            onChange={(e) => setStopInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) handleStopInput()
            }}
          />
          <Button variant="outline" size="icon" onClick={handleStopInput}>
            <PlusCircledIcon />
          </Button>
        </div>

        {/* //* values */}
        <div className="w-full space-y-1">
          {stop.map((v, i) => (
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
                  const newStop = stop.filter((_, _i) => i !== _i)
                  updateSession((s) => (s.parameters.stop = newStop))
                }}
              >
                <CrossCircledIcon />
              </Button>
            </Badge>
          ))}
        </div>
      </div>

      {/* //* temperature */}
      <SliderInput
        label="temperature"
        min={0}
        max={2}
        step={0.01}
        value={temperature ?? 1}
        onChange={(v) => updateSession((s) => (s.parameters.temperature = v))}
        decimal={2}
      />

      {/* //* top_p */}
      <SliderInput
        label="top_p"
        min={0}
        max={2}
        step={0.01}
        value={top_p ?? 1}
        onChange={(v) => updateSession((s) => (s.parameters.top_p = v))}
        decimal={2}
      />
    </div>
  )
}

type SliderInputProps = {
  label: string
  id?: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number | undefined) => void
  decimal?: number
}
function SliderInput({ label, min, max, step, decimal, ...props }: SliderInputProps) {
  const id = props.id ?? label

  const valueNumber = props.value
  const valueFixed = decimal ? valueNumber.toFixed(decimal) : valueNumber

  const handleInputChange = (value: string | number | undefined) => {
    props.onChange(typeof value === 'undefined' ? value : Number(value))
  }

  return (
    <div className="flex flex-col items-center font-mono">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex w-full space-x-1">
        <Slider
          id={`${id}_slider`}
          min={min}
          max={max}
          step={step}
          value={[valueNumber]}
          onValueChange={([v]) => handleInputChange(v)}
          minStepsBetweenThumbs={step}
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
        />
      </div>
    </div>
  )
}
