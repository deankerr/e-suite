'use client'

import { useMutation, useQuery } from 'convex/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { PromptEditor } from '@/components/prompts/PromptEditor'
import { api } from '@/convex/_generated/api'

import type { Id } from '@/convex/_generated/dataModel'

export default function Page({ params }: { params: { textsId: string } }) {
  const router = useRouter()

  const textsId = params.textsId as Id<'texts'>
  const isNewPrompt = textsId === 'new'

  const prompt = useQuery(api.db.texts.getPrompt, !isNewPrompt ? { _id: textsId } : 'skip')

  const setPrompt = useMutation(api.db.texts.setPrompt)

  const handleSave = ({ title, content }: { title: string; content: string }) => {
    if (!title) {
      toast.error('Please enter a title')
      return
    }

    if (!content) {
      toast.error('Please enter a prompt')
      return
    }

    setPrompt({
      _id: prompt?._id,
      title,
      content,
    })
      .then((textId) => {
        toast.success('Prompt saved')
        router.replace(`/prompts/${textId}`)
      })
      .catch((error) => {
        console.error(error)
        toast.error('Failed to save prompt')
      })
  }

  if (isNewPrompt) {
    return <PromptEditor initialTitle="" initialContent="" onSave={handleSave} />
  }

  if (!prompt) return <div>No prompt</div>

  return (
    <PromptEditor
      initialTitle={prompt.title ?? ''}
      initialContent={prompt.content}
      onSave={handleSave}
    />
  )
}
