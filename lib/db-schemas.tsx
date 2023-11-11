'use server'

import { auth } from '@/auth'
import z from 'zod'
import { AppError } from './error'
import { prisma } from './prisma'

// TODO complete
const schemaEngine = z.object({
  id: z.string(),
  model: z.string(),
  providerId: z.string(),
  displayName: z.string(),
  creatorName: z.string(),
})

const schemaAgentParameters = z
  .object({
    temperature: z.number(),
    max_tokens: z.number(),
    frequency_penalty: z.number(),
    presence_penalty: z.number(),
    repetition_penalty: z.number(),
    top_p: z.number(),
    top_k: z.number(),
    stop: z.string().array(),
    stop_token: z.string().array(),
  })
  .partial()

const schemaAgent = z.object({
  id: z.string(),
  // owner
  ownerId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),

  name: z.string(),
  image: z.string(),

  engine: schemaEngine,
  engineId: z.string(),
  parameters: z.record(schemaAgentParameters),
})

const schemaWorkbench = z
  .object({
    tabs: z.array(
      z.object({
        // Tab
        id: z.string(),
        agentId: z.string(),
        isOpen: z.boolean(),
      }),
    ),
    activeTabId: z.string(),
  })
  .catch({
    tabs: [],
    activeTabId: '',
  })

const schemaUser = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().optional(),
  emailVerified: z.string().optional(),
  image: z.string().optional(),

  role: z.enum(['USER', 'ADMIN']),
  workbench: schemaWorkbench,

  agents: z.array(schemaAgent),
})

async function getUserAuth() {
  const session = await auth()
  if (!session) throw new AppError('You are not logged in.')
  return session.user
}

//* "Private" / client requests / session
// Get the user + all relevant relations
export async function getSuiteUser() {
  try {
    const user = await getUserAuth()
    const suiteUser = await prisma.user.findUniqueOrThrow({
      where: {
        id: user.id,
      },
      include: {
        agents: {
          include: {
            engine: true,
          },
        },
      },
    })

    const parsed = schemaUser.parse(suiteUser)
    return parsed
  } catch (err) {
    if (err instanceof AppError) {
      console.error(err)
      throw err
    } else {
      console.error(err)
      throw new Error('An unknown error occurred.')
    }
  }
}
