'use client'

import { useState } from 'react'
import { ImageSquare, PaperPlaneRight } from '@phosphor-icons/react/dist/ssr'
import { Button, Card } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'

import { ImageModelCard, ImageModelCardSkeleton } from '@/components/cards/ImageModelCard'
import { TextareaAutosize } from '@/components/ui/TextareaAutosize'
import { api } from '@/convex/_generated/api'
import { useImageModels } from '@/lib/queries'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const prioritizedModelKeys = [
  'fal::fal-ai/stable-diffusion-v3-medium',
  'fal::fal-ai/pixart-sigma',
  'sinkin::Juggernaut%20XL',
  'sinkin::CyberRealistic',
]

export default function Page() {
  const router = useRouter()
  const imageModels = useImageModels()

  const prioritizedModels = imageModels?.filter((model) =>
    prioritizedModelKeys.includes(model.resourceKey),
  )
  const otherModels = imageModels?.filter(
    (model) => !prioritizedModelKeys.includes(model.resourceKey),
  )
  const displayModels = prioritizedModels?.concat(otherModels ?? []).slice(0, 4)

  const [selectedModelKey, setSelectedModelKey] = useState('fal::fal-ai/pixart-sigma')
  const selectedModel = imageModels?.find((model) => model.resourceKey === selectedModelKey)

  const [message, setMessage] = useState('')
  const sendAppendMessage = useMutation(api.db.threads.append)

  return (
    <div className="h-full w-full overflow-y-auto p-2 pt-0 sm:pl-0 sm:pt-2">
      <Card className="mx-auto min-h-64 w-full max-w-xl space-y-4">
        <h1 className="wt-title-3">Start a new Generation</h1>
        <div className="mx-auto grid grid-cols-2 justify-items-center gap-2">
          {displayModels?.map((model) => (
            <ImageModelCard
              key={model._id}
              model={model}
              className={cn(
                'cursor-pointer',
                selectedModelKey === model.resourceKey ? 'outline outline-2 outline-accent-11' : '',
              )}
              onClick={() => setSelectedModelKey(model.resourceKey)}
            />
          ))}
          {!imageModels && (
            <>
              <ImageModelCardSkeleton />
              <ImageModelCardSkeleton />
              <ImageModelCardSkeleton />
              <ImageModelCardSkeleton />
            </>
          )}
        </div>

        <div className="space-y-3">
          <TextareaAutosize
            minRows={6}
            rows={6}
            value={message}
            onValueChange={setMessage}
            placeholder="Prompt..."
          />
          <div className="shrink-0 gap-3 flex-between">
            <div className="flex items-center gap-2">
              <ImageSquare className="size-6" />
              {selectedModel?.name}
            </div>
            <Button
              size="3"
              onClick={() => {
                if (!selectedModel) return

                sendAppendMessage({
                  message: {
                    content: message,
                  },
                  inference: {
                    type: 'text-to-image',
                    prompt: message,
                    endpoint: selectedModel?.endpoint,
                    endpointModelId: selectedModel?.endpointModelId,
                    resourceKey: selectedModel?.resourceKey,
                    n: 4,
                    width: selectedModel.sizes.square[0] ?? 512,
                    height: selectedModel.sizes.square[1] ?? 512,
                  },
                }).then(({ slug }) => {
                  setMessage('')
                  router.push(`/c/${slug}`)
                })
              }}
            >
              Send
              <PaperPlaneRight className="size-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
