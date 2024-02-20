import { Slider } from '../ui/Slider'
import { ModelSelect } from './ModelSelect'
import { ThreadAtoms } from './useThread'

type Props = {
  threadAtoms: ThreadAtoms
}

export const InferenceParameterControls = ({ threadAtoms }: Props) => {
  return (
    <>
      <ModelSelect inputAtom={threadAtoms.model} />
      <Slider inputAtom={threadAtoms.max_tokens} />
      <Slider inputAtom={threadAtoms.temperature} />
      <Slider inputAtom={threadAtoms.top_p} />
      <Slider inputAtom={threadAtoms.top_k} />
      <Slider inputAtom={threadAtoms.repetition_penalty} />
    </>
  )
}
