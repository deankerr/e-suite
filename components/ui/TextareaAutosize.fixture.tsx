'use client'

import { useFixtureInput } from 'react-cosmos/client'

import { TextareaAutosize } from '@/components/ui/TextareaAutosize'

export default function TextareaAutosizeFixture() {
  const [value, setValue] = useFixtureInput('value', 'text in my area')
  return <TextareaAutosize value={value} onValueChange={setValue} />
}
