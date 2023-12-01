import type { getEngineById } from '@/db/data'
import z from 'zod'

export type Engine = NonNullable<Awaited<ReturnType<typeof getEngineById>>>
