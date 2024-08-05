'use client'

import { useRouter } from 'next/navigation'

import { Gallery } from '@/components/message/Gallery'
import { Message } from '@/components/message/Message'
import { SectionPanel } from '@/components/pages/SectionPanel'
import { appConfig } from '@/config/config'
import { extractInferenceConfig, getMessageName } from '@/convex/shared/helpers'
import { useImageModel, useMessage } from '@/lib/api'

import type { EMessage, EThread, TextToImageConfig } from '@/convex/types'

export const MessageDetail = ({ slug, msg }: { slug: string; msg: string }) => {
  const router = useRouter()
  const { thread, message } = useMessage(slug, msg)

  return (
    <SectionPanel
      title="Message Detail"
      onClosePanel={() => router.replace(`${appConfig.threadUrl}/${slug}`)}
      loading={!thread || !message}
    >
      {thread && message && <Body thread={thread} message={message} />}
    </SectionPanel>
  )
}

const Body = ({ message }: { thread: EThread; message: EMessage }) => {
  const name = getMessageName(message)

  const { textToImageConfig } = extractInferenceConfig(message.inference)

  if (textToImageConfig) {
    return <GenerationView config={textToImageConfig} message={message} />
  }

  return (
    <div className="p-2">
      <div className="flex gap-2">
        <div className="font-medium text-accentA-11">{name}</div>
        <div className="font-mono text-gray-11">{message.role}</div>
      </div>
      <Message message={message} hideTimeline />
    </div>
  )
}

const GenerationView = ({ config, message }: { config: TextToImageConfig; message: EMessage }) => {
  const { model } = useImageModel(config.resourceKey)
  const job = message.jobs.find((job) => job.pipeline === 'textToImage')?.stepResults[0]

  return (
    <div className="flex flex-col gap-2 overflow-hidden p-2">
      <div className="text-sm">
        <div>prompt: {config.prompt}</div>
        {model && <div>model: {model.name}</div>}
        {job && <div>time taken: {(job.endTime - job.startTime) / 1000} sec</div>}
      </div>
      <Gallery message={message} />
    </div>
  )
}
