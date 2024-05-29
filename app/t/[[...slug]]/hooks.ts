import { useParams, useRouter } from 'next/navigation'

import { chatModels, imageModels } from '@/convex/shared/models'

export const useThreadStack = () => {
  const router = useRouter()
  const params = useParams()
  const stack = params.slug?.[0]?.split('-') ?? []

  const add = (slug: string) => {
    const newStack = [...stack, slug]
    router.replace(`/t/${newStack.join('-')}`)
  }

  const remove = (slug?: string) => {
    if (!slug) return
    const newStack = stack.filter((s) => s !== slug)
    router.replace(`/t/${newStack.join('-')}`)
  }

  return { stack, add, remove }
}

export const useModelList = ({
  endpoint,
  endpointModelId,
}: {
  endpoint?: string
  endpointModelId?: string
}) => {
  const models = [...chatModels, ...imageModels]
  const current = models.find(
    (model) => endpoint === model.endpoint && endpointModelId === model.endpointModelId,
  )
  return { current, chatModels, imageModels }
}
