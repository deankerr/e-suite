'use client'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { atom } from 'jotai'
import { useAtomCallback } from 'jotai/utils'
import { useCallback, useMemo } from 'react'
import { toast } from 'sonner'

export type ThreadHelpers = ReturnType<typeof useThread>
export type ThreadAtoms = ReturnType<typeof createThreadAtoms>
export type TextInputAtom = ReturnType<typeof createTextInputAtom>
export type NumberInputAtom = ReturnType<typeof createNumberInputAtom>

export const useThread = (args: { threadId?: Id<'threads'> }) => {
  const threadId = args.threadId
  const queryKey = threadId ? { id: threadId } : 'skip'

  const threadAtoms = useMemo(() => createThreadAtoms(threadId), [threadId])
  const readAtomValues = useAtomCallback(
    useCallback(
      (get) => {
        return {
          message: get(threadAtoms.message.atom),
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

  const thread = useQuery(api.threads.threads.get, queryKey)
  const runSend = useMutation(api.threads.threads.send)

  const send = () => {
    if (!thread) return
    const { message, ...inferenceParameters } = readAtomValues()

    runSend({
      threadId: thread._id,
      messages: [
        {
          role: 'user',
          // name: '',
          content: message,
        },
        {
          role: 'assistant',
          content: '',
          inferenceParameters,
        },
      ],
    })
      .then((id) => {
        console.log('sent', id)
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

  return { thread, send, threadAtoms }
}

function createThreadAtoms(threadId?: string) {
  const threadAtoms = {
    threadId,
    message: createTextInputAtom({ label: 'Message', name: 'message', initialValue: '' }),
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

function createTextInputAtom(args: { label: string; name: string; initialValue: string }) {
  return { ...args, atom: atom(args.initialValue) }
}

function createNumberInputAtom(args: {
  label: string
  name: string
  initialValue: number
  min: number
  max: number
  step: number
}) {
  return { ...args, atom: atom(args.initialValue) }
}
