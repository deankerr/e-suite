import { Combobox } from '@/components/ui/combobox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { ChatModelOption } from '@/lib/api'
import { raise } from '@/lib/utils'
import { ModelsCombobox } from './models-combobox'
import { ChatSession } from './types'

type Props = {
  session: ChatSession
  updateSession: (fn: (session: ChatSession) => void) => void
  modelsAvailable: ChatModelOption[]
}

export function ModelConfigPanel({ session, updateSession, modelsAvailable }: Props) {
  const { parameters, panel } = session

  const { frequency_penalty, presence_penalty, stream, max_tokens, n, temperature, top_p, stop } =
    parameters

  const max_tokensMax = 4097 // TODO
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
      {/* <div className="flex items-center space-x-2">
        <Label htmlFor="n">n</Label>
        <Input
          className="w-20 pr-0"
          id="n"
          type="number"
          min={1}
          max={10}
          defaultValue={1}
          placeholder="1"
        />
      </div> */}

      {/* //* frequency_penalty */}
      <div className="flex w-full flex-col items-center space-x-2 space-y-1">
        <Label htmlFor="frequency_penalty" className="font-mono">
          frequency_penalty
        </Label>
        <div className="flex w-full space-x-1">
          <Slider
            id="frequency_penalty_slider"
            min={-2.0}
            max={2.0}
            step={0.01}
            value={[frequency_penalty ?? 0]}
            onValueChange={([v]) => updateSession((s) => (s.parameters.frequency_penalty = v))}
            minStepsBetweenThumbs={0.01}
          />
          <Input
            className="w-20 pr-0"
            id="frequency_penalty"
            type="number"
            min={-2.0}
            max={2.0}
            step={0.01}
            value={frequency_penalty ?? 0}
            onChange={(v) =>
              updateSession((s) => (s.parameters.frequency_penalty = Number(v.target.value)))
            }
            placeholder="1.0"
          />
        </div>
      </div>

      {/* //* presence_penalty */}
      <div className="flex w-full flex-col items-center space-x-2 space-y-1">
        <Label htmlFor="presence_penalty" className="font-mono">
          presence_penalty
        </Label>
        <div className="flex w-full space-x-1">
          <Slider
            id="presence_penalty_slider"
            min={-2.0}
            max={2.0}
            step={0.01}
            value={[presence_penalty ?? 0]}
            onValueChange={([v]) => updateSession((s) => (s.parameters.presence_penalty = v))}
            minStepsBetweenThumbs={0.01}
          />
          <Input
            className="w-20 pr-0"
            id="presence_penalty"
            type="number"
            min={-2.0}
            max={2.0}
            step={0.01}
            value={presence_penalty ?? 0}
            onChange={(v) =>
              updateSession((s) => (s.parameters.presence_penalty = Number(v.target.value)))
            }
            placeholder="1.0"
          />
        </div>
      </div>

      {/* //* max_tokens */}
      <div className="flex items-center space-x-2 space-y-1 font-mono">
        <Label htmlFor="max_tokens">max_tokens</Label>
        <div className="flex w-full space-x-1">
          <Slider
            id="max_tokens_slider"
            min={1}
            max={max_tokensMax}
            step={1}
            value={[max_tokens ?? 0]}
            onValueChange={([v]) => updateSession((s) => (s.parameters.max_tokens = v))}
          />
          <Input
            className="w-20 pr-0"
            id="max_tokens"
            type="number"
            min={1}
            max={max_tokensMax}
            step={1}
            value={max_tokens ?? 0}
            onChange={(v) =>
              updateSession((s) => (s.parameters.max_tokens = Number(v.target.value)))
            }
            placeholder="1024"
          />
        </div>
      </div>

      {/* //* stop */}
      <div className="flex flex-col items-center space-x-2 space-y-1 font-mono">
        <Label htmlFor="stop">stop</Label>

        <div className="flex space-x-1">
          <Input id="stop_1" />
          <Input id="stop_2" />
          <Input id="stop_3" />
          <Input id="stop_4" />
        </div>
      </div>

      {/* //* temperature */}
      <div className="flex items-center space-x-2 space-y-1 font-mono">
        <Label htmlFor="temperature">temperature</Label>
        <div className="flex w-full space-x-1">
          <Slider
            id="temperature_slider"
            min={0}
            max={2}
            step={0.01}
            value={[temperature ?? 1]}
            onValueChange={([v]) => updateSession((s) => (s.parameters.temperature = v))}
          />
          <Input
            className="w-20 pr-0"
            id="temperature"
            type="number"
            min={0}
            max={2}
            step={0.01}
            value={temperature ?? 1}
            onChange={(v) =>
              updateSession((s) => (s.parameters.temperature = Number(v.target.value)))
            }
            placeholder="1"
          />
        </div>
      </div>

      {/* //* top_p */}
      <div className="flex items-center space-x-2 space-y-1 font-mono">
        <Label htmlFor="top_p">top_p</Label>
        <div className="flex w-full space-x-1">
          <Slider
            id="top_p_slider"
            min={0}
            max={2}
            step={0.01}
            value={[top_p ?? 1]}
            onValueChange={([v]) => updateSession((s) => (s.parameters.top_p = v))}
          />
          <Input
            className="w-20 pr-0"
            id="top_p"
            type="number"
            min={0}
            max={2}
            step={0.01}
            value={top_p ?? 1}
            onChange={(v) => updateSession((s) => (s.parameters.top_p = Number(v.target.value)))}
            placeholder="1"
          />
        </div>
      </div>
    </div>
  )
}
