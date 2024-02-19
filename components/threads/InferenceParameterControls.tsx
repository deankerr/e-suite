import { Slider } from '../ui/Slider'
import { ModelSelect } from './ModelSelect'
import { paramValues } from './threads.store'

type InferenceParameterControlsProps = {
  props?: unknown
}

export const InferenceParameterControls = ({}: InferenceParameterControlsProps) => {
  return (
    <>
      <ModelSelect label="Model" inputData={paramValues.model} />
      <Slider label="Max tokens" paramValue={paramValues['max_tokens']} />
      <Slider label="Temperature" paramValue={paramValues['temperature']} />
      <Slider label="Top P" paramValue={paramValues['top_p']} />
      <Slider label="Top K" paramValue={paramValues['top_k']} />
      <Slider label="Repetition penalty" paramValue={paramValues['repetition_penalty']} />
    </>
  )
}
