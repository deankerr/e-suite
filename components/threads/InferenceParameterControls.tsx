import { Slider } from '../ui/Slider'
import { Textarea } from '../ui/Textarea'
import { TextInput } from '../ui/TextInput'
import { ModelSelect } from './ModelSelect'

import type { ThreadAtoms } from './useThread'

type Props = {
  threadAtoms: ThreadAtoms
}

export const InferenceParameterControls = ({ threadAtoms }: Props) => {
  return (
    <>
      <Textarea className="p-3" inputAtom={threadAtoms.systemPrompt} minRows={3} maxRows={6} />
      <TextInput className="p-3" inputAtom={threadAtoms.name} />
      <ModelSelect inputAtom={threadAtoms.model} />
      <Slider inputAtom={threadAtoms.max_tokens} />
      <Slider inputAtom={threadAtoms.temperature} />
      <Slider inputAtom={threadAtoms.top_p} />
      <Slider inputAtom={threadAtoms.top_k} />
      <Slider inputAtom={threadAtoms.repetition_penalty} />
    </>
  )
}
