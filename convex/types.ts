import { GenericEnt, GenericEntWriter } from 'convex-ents'
import { CustomCtx } from 'convex-helpers/server/customFunctions'
import { api } from './_generated/api'
import { TableNames, type Doc } from './_generated/dataModel'
import type { dimensions, modelBases, modelTypes, nsfwRatings } from './constants'
import { mutation, query } from './functions'
import { entDefinitions } from './schema'

export type QueryCtx = CustomCtx<typeof query>
export type MutationCtx = CustomCtx<typeof mutation>

export type Ent<TableName extends TableNames> = GenericEnt<typeof entDefinitions, TableName>
export type EntWriter<TableName extends TableNames> = GenericEntWriter<
  typeof entDefinitions,
  TableName
>

//NOTE refactor:

export type Image = Doc<'images'>
export type ImageModel = Doc<'imageModels'> & { images?: (Image | null)[] }
export type Generation = Doc<'generations'>

export type GenerationResult = (typeof api.generations.page._returnType.page)[number]
export type ImageModelResult = (typeof api.imageModels.page._returnType.page)[number]

export type NsfwRatings = (typeof nsfwRatings)[number]
export type ModelBase = (typeof modelBases)[number]
export type ModelType = (typeof modelTypes)[number]
export type Dimension = (typeof dimensions)[number]
