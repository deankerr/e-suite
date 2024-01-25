import { api } from './_generated/api'
import type { Doc } from './_generated/dataModel'
import type { modelBases, modelTypes, nsfwRatings } from './constants'

export type Image = Doc<'images'>
export type ImageModel = Doc<'imageModels'> & { images?: (Image | null)[] }
export type ImageModelProvider = Doc<'imageModelProviders'>

export type Generation = Doc<'generations'>

export type NsfwRatings = (typeof nsfwRatings)[number]
export type ModelBase = (typeof modelBases)[number]
export type ModelType = (typeof modelTypes)[number]

export type GenerationResult = (typeof api.generations.page._returnType.page)[number]
export type ImageModelResult = (typeof api.imageModels.page._returnType.page)[number]
