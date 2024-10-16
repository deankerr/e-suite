'use client';
import { use } from "react";

import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { usePrompt } from '@/app/lib/api/prompts'
import { PromptEditor } from '@/components/prompts/PromptEditor'
import { PanelEmpty, PanelLoading } from '@/components/ui/Panel'
import { api } from '@/convex/_generated/api'

import type { Id } from '@/convex/_generated/dataModel'

export default function Page(props: { params: Promise<{ textsId: string }> }) {
  const params = use(props.params);
  const router = useRouter()

  const textsId = params.textsId as Id<'texts'>
  const isNewPrompt = textsId === 'new'

  const prompt = usePrompt(!isNewPrompt ? textsId : '')

  const setPrompt = useMutation(api.db.texts.setPrompt)
  const deletePrompt = useMutation(api.db.texts.deletePrompt)

  const handleSave = ({ title, content }: { title: string; content: string }) => {
    if (!title) return toast.error('Please enter a title')
    if (!content) return toast.error('Please enter a prompt')

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

  const handleDelete = () => {
    if (!prompt?._id) return

    deletePrompt({ _id: prompt._id })
      .then(() => {
        toast.success('Prompt deleted')
        router.replace('/prompts')
      })
      .catch((error) => {
        console.error(error)
        toast.error('Failed to delete prompt')
      })
  }

  if (isNewPrompt) {
    return <PromptEditor initialTitle="" initialContent="" onSave={handleSave} />
  }

  if (!prompt) {
    if (prompt === null) {
      return <PanelEmpty />
    }
    return <PanelLoading />
  }

  return (
    <PromptEditor
      initialTitle={prompt.title ?? ''}
      initialContent={prompt.content}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  )
}
