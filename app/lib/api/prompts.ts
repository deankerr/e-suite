import { useCachedQuery } from '@/app/lib/api/helpers'
import { api } from '@/convex/_generated/api'

export const usePrompts = () => {
  return useCachedQuery(api.db.texts.listPrompts, {})
}

export const usePrompt = (promptId: string) => {
  const prompts = usePrompts()
  const prompt = prompts ? (prompts.find((prompt) => prompt._id === promptId) ?? null) : undefined

  return prompt
}
