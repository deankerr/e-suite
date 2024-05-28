import { useParams, useRouter } from 'next/navigation'

export const useThreadStack = () => {
  const router = useRouter()
  const params = useParams()
  const stack = params.slug?.[0]?.split('-') ?? []

  const add = (slug: string) => {
    const newStack = [...stack, slug]
    router.replace(`/multi/${newStack.join('-')}`)
  }

  const remove = (slug?: string) => {
    if (!slug) return
    const newStack = stack.filter((s) => s !== slug)
    router.replace(`/multi/${newStack.join('-')}`)
  }

  return { stack, add, remove }
}
