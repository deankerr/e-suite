'use client'

import { useFixtureSelect } from 'react-cosmos/client'

import { Composer } from '@/components/composer/Composer'

export default function ComposerFixture() {
  const [type] = useFixtureSelect('type', {
    options: ['gpt4o', 'pixart', ''],
  })
  const initialResourceKey =
    type === 'gpt4o' ? chatModelKeys.gpt4o : type === 'pixart' ? imageModelKeys.pixart : undefined

  return (
    <div className="flex-col-end h-full">
      <div className="mb-[50%] w-full max-w-2xl rounded border border-grayA-6 bg-gray-2">
        <Composer key={initialResourceKey} initialResourceKey={initialResourceKey} />
      </div>
    </div>
  )
}

const chatModelKeys = {
  gpt4o: 'openai::gpt-4o',
  pplx: 'openrouter::perplexity/llama-3-sonar-large-32k-online',
  sonnet: 'openrouter::anthropic/claude-3.5-sonnet',
  llama3: 'openrouter::meta-llama/llama-3.1-70b-instruct',
}

const imageModelKeys = {
  pixart: 'fal::fal-ai/pixart-sigma',
}
