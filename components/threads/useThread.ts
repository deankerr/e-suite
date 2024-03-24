import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Permissions } from '@/convex/schema'
import { useMutation, useQuery } from 'convex/react'
import { useAtomCallback } from 'jotai/utils'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import { createNumberInputAtom, createTextInputAtom } from '../atoms'

export type ThreadHelpers = ReturnType<typeof useThread>
export type ThreadAtoms = ReturnType<typeof createThreadAtoms>
export type TextInputAtom = ReturnType<typeof createTextInputAtom>
export type NumberInputAtom = ReturnType<typeof createNumberInputAtom>

export const useThread = ({ threadId }: { threadId?: Id<'threads'> }) => {
  const router = useRouter()

  const thread = useQuery(api.threads.threads.get, { id: threadId })

  const messages = useMemo(() => thread?.messages.toReversed() ?? [], [thread?.messages])

  //* Parameters
  const threadAtoms = useMemo(
    () => ({
      threadId,
      message: createTextInputAtom({
        label: 'Message',
        name: 'message',
        initialValue: '',
      }),
      systemPrompt: createTextInputAtom({
        label: 'System Prompt',
        name: 'systemPrompt',
        initialValue: thread?.systemPrompt ?? '',
      }),
      name: createTextInputAtom({ label: 'Name', name: 'name', initialValue: thread?.name ?? '' }),
      model: createTextInputAtom({
        label: 'Model',
        name: 'model',
        initialValue: thread?.parameters?.model ?? 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO',
      }),
      max_tokens: createNumberInputAtom({
        label: 'Max tokens',
        name: 'max_tokens',
        initialValue: thread?.parameters?.max_tokens ?? 512,
        min: 1,
        max: 2048,
        step: 1,
      }),
      temperature: createNumberInputAtom({
        label: 'Temperature',
        name: 'temperature',
        initialValue: thread?.parameters?.temperature ?? 0.7,
        min: 0,
        max: 2,
        step: 0.1,
      }),
      top_p: createNumberInputAtom({
        label: 'Top P',
        name: 'top_p',
        initialValue: thread?.parameters?.top_p ?? 0.7,
        min: 0,
        max: 1,
        step: 0.1,
      }),
      top_k: createNumberInputAtom({
        label: 'Top K',
        name: 'top_k',
        initialValue: thread?.parameters?.top_k ?? 50,
        min: 1,
        max: 100,
        step: 1,
      }),
      repetition_penalty: createNumberInputAtom({
        label: 'Repetition penalty',
        name: 'repetition_penalty',
        initialValue: thread?.parameters?.repetition_penalty ?? 1,
        min: 1,
        max: 2,
        step: 0.01,
      }),
    }),
    [
      threadId,
      thread?.name,
      thread?.systemPrompt,
      thread?.parameters?.model,
      thread?.parameters?.max_tokens,
      thread?.parameters?.temperature,
      thread?.parameters?.top_p,
      thread?.parameters?.top_k,
      thread?.parameters?.repetition_penalty,
    ],
  )

  const readAtomValues = useAtomCallback(
    useCallback(
      (get) => {
        return {
          message: get(threadAtoms.message.atom),
          systemPrompt: get(threadAtoms.systemPrompt.atom),
          name: get(threadAtoms.name.atom),
          model: get(threadAtoms.model.atom),
          max_tokens: get(threadAtoms.max_tokens.atom),
          temperature: get(threadAtoms.temperature.atom),
          top_p: get(threadAtoms.top_p.atom),
          top_k: get(threadAtoms.top_k.atom),
          repetition_penalty: get(threadAtoms.repetition_penalty.atom),
        }
      },
      [threadAtoms],
    ),
  )

  //* Send input
  const runSend = useMutation(api.threads.threads.send)

  const send = () => {
    const { message, name, systemPrompt, ...inferenceParameters } = readAtomValues()

    runSend({
      threadId: threadId ? threadId : undefined,
      messages: [
        {
          role: 'user',
          name,
          content: message,
        },
        {
          role: 'assistant',
          content: '',
          inferenceParameters,
        },
      ],
      systemPrompt,
    })
      .then((id) => {
        console.log('sent', id)
        if (!threadId) router.push(`/chat/${id}`)
      })
      .catch((error) => {
        console.error(error)
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('An unknown error occurred.')
        }
      })
  }

  //* Permissions
  const runUpdatePermissions = useMutation(api.threads.threads.updatePermissions)
  const updatePermissions = (permissions: Permissions) => {
    if (!thread) return
    runUpdatePermissions({ id: thread._id, permissions })
      .then((id) => console.log('permissions updated', id))
      .catch((error) => {
        console.error(error)
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('An unknown error occurred.')
        }
      })
  }

  return { thread, messages, send, threadAtoms, updatePermissions }
}

function createThreadAtoms(threadId?: string) {
  const threadAtoms = {
    threadId,
    message: createTextInputAtom({ label: 'Message', name: 'message', initialValue: '' }),
    systemPrompt: createTextInputAtom({
      label: 'System Prompt',
      name: 'systemPrompt',
      initialValue: '',
    }),
    name: createTextInputAtom({ label: 'Name', name: 'name', initialValue: '' }),
    model: createTextInputAtom({
      label: 'Model',
      name: 'model',
      initialValue: 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO',
    }),
    max_tokens: createNumberInputAtom({
      label: 'Max tokens',
      name: 'max_tokens',
      initialValue: 512,
      min: 1,
      max: 2048,
      step: 1,
    }),
    temperature: createNumberInputAtom({
      label: 'Temperature',
      name: 'temperature',
      initialValue: 0.7,
      min: 0,
      max: 2,
      step: 0.1,
    }),
    top_p: createNumberInputAtom({
      label: 'Top P',
      name: 'top_p',
      initialValue: 0.7,
      min: 0,
      max: 1,
      step: 0.1,
    }),
    top_k: createNumberInputAtom({
      label: 'Top K',
      name: 'top_k',
      initialValue: 50,
      min: 1,
      max: 100,
      step: 1,
    }),
    repetition_penalty: createNumberInputAtom({
      label: 'Repetition penalty',
      name: 'repetition_penalty',
      initialValue: 1,
      min: 1,
      max: 2,
      step: 0.01,
    }),
  }

  return threadAtoms
}
