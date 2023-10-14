export function createErrorResponse(message: string, status = 400) {
  return new Response(message, { status, statusText: message })
}

export function getChatModels() {
  const models = [
    {
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      label: 'OpenAI: GPT-3.5 Turbo',
    },
    {
      provider: 'openai',
      model: 'gpt-4',
      label: 'OpenAI: GPT-4',
    },
    {
      provider: 'openrouter',
      model: 'meta-llama/llama-2-70b-chat',
      label: 'Meta: Llama v2 70B Chat',
    },
    {
      provider: 'openrouter',
      model: 'jondurbin/airoboros-l2-70b',
      label: 'Airoboros L2 70B',
    },
    {
      provider: 'openrouter',
      model: 'migtissera/synthia-70b',
      label: 'Synthia 70B',
    },
    {
      provider: 'openrouter',
      model: 'xwin-lm/xwin-lm-70b',
      label: 'Xwin 70B',
    },
  ]

  return models
}
