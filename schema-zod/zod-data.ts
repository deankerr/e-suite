import { Prisma, Engine as PrismaEngine } from '@prisma/client'
import z from 'zod'

const engineWithProvider = Prisma.validator<Prisma.EngineDefaultArgs>()({
  include: { provider: true },
})

export type Engine = Prisma.EngineGetPayload<typeof engineWithProvider>
