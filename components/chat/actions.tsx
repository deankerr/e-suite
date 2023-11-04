'use server'

import { prisma } from '@/lib/prisma'

export async function getEngines() {
  console.log('getEnginesData')
  return await prisma.engine.findMany()
}
