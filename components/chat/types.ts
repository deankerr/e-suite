export type ChatSession = {
  id: Readonly<string> // id
  name: string // unique
  engineId: string
  engineInput: Record<string, EngineInput>
}

export type EngineInput = {
  fieldsEnabled: string[]
  temperature: number
  max_tokens: number
  frequency_penalty: number
  presence_penalty: number
  repetition_penalty: number
  top_p: number
  top_k: number
  stop: string[]
  stop_token: string[]
}
