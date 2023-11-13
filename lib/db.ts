import { prisma } from './prisma'

// // TODO integrate prisma?
// async function getUser(userId: string) {
//   return await prisma.user.findFirstOrThrow({ where: { id: userId }, include: { agents: true } })
// }

// async function getUserById(userId: string) {
//   return await prisma.user.findFirstOrThrow({ where: { id: userId } })
// }

// async function getEngineById(engineId: string) {
//   return await prisma.engine.findFirstOrThrow({ where: { id: engineId } })
// }

// async function getSuiteUser(userId: string) {
//   const suiteUser = await prisma.user.findUniqueOrThrow({
//     where: {
//       id: userId,
//     },
//     include: {
//       agents: {
//         include: {
//           engine: true,
//         },
//       },
//     },
//   })

//   return {
//     ...suiteUser,
//   }
// }

// async function getSuiteUserAgent(userId: string, agentId: string) {
//   return await prisma.agent.findUniqueOrThrow({
//     where: {
//       id: agentId,
//       ownerId: userId,
//     },
//   })
// }

// // async function updateWorkbench(userId: string, merge: SuiteWorkbenchUpdateMergeObject) {
// //   const current = await prisma.user.findUniqueOrThrow({
// //     where: { id: userId },
// //     select: { workbench: true },
// //   })
// //   // const parsed = jsonRecord.parse(current.workbench)
// //   // await prisma.user.update({ where: { id: userId }, data: { workbench: { ...parsed, ...merge } } })
// // }

// async function updateUserAgent(
//   userId: string,
//   agentId: string,
//   merge: SuiteAgentUpdateMergeObject,
// ) {
//   await prisma.agent.update({
//     where: {
//       id: agentId,
//       ownerId: userId,
//     },
//     data: {
//       ...merge,
//     },
//   })
// }

// export const db = {
//   getUser,
//   getSuiteUser,
//   getSuiteUserAgent,
//   updateWorkbench,
//   updateUserAgent,
// }

// export type SuiteUser = Awaited<ReturnType<typeof getSuiteUser>>
// export type User = Awaited<ReturnType<typeof getUser>>
// export type Engine = Awaited<ReturnType<typeof getEngineById>>
