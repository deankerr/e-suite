import { Slider } from '../ui/Slider'
import { ModelSelect } from './ModelSelect'
import { InputParams } from './threads.store'

type Props = {
  inputData: InputParams
}

export const InferenceParameterControls = ({ inputData }: Props) => {
  return (
    <>
      <ModelSelect label="Model" inputData={inputData.model} />
      <Slider label="Max tokens" paramValue={inputData['max_tokens']} />
      <Slider label="Temperature" paramValue={inputData['temperature']} />
      <Slider label="Top P" paramValue={inputData['top_p']} />
      <Slider label="Top K" paramValue={inputData['top_k']} />
      <Slider label="Repetition penalty" paramValue={inputData['repetition_penalty']} />
    </>
  )
}
