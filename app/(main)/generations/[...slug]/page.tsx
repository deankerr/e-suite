'use client'

import { GenerationShell } from '@/app/components/generations/GenerationShell'
import { Spinner } from '@/app/components/ui/Spinner'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import z from 'zod'

export default function GenerationIdPage({
  params,
}: {
  params: { slug: [Id<'generations'>, string] }
}) {
  const [id, focusString] = params.slug
  const generation = useQuery(api.generations.do.get, id ? { id } : 'skip')

  if (generation === undefined) return <Spinner />
  if (generation === null) return <div>Generation not found :-(</div>

  const focus = z
    .string()
    .optional()
    .transform((v) => {
      const n = Number(v)
      return Number.isNaN(n) ? undefined : n
    })
    .parse(focusString)

  return <GenerationShell className="w-full border-none" generation={generation} focus={focus} />
}
