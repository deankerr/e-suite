import { OpenAIStream } from 'ai'
import { Tokens } from 'ai/react'
import OpenAI from 'openai'

export const runtime = 'edge'
const disabled = true

export async function RscChatDemo() {
  if (disabled) return <p>RscChat Disabled :)</p>
  const openai = new OpenAI()
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [{ role: 'user', content: 'Give me 10 random English names.' }],
  })

  // Convert the response into a friendly text-stream using the SDK's wrappers
  const stream = OpenAIStream(response)

  return <Tokens stream={stream} />
}
