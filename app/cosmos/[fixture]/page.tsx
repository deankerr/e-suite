import * as cosmosImports from '@/cosmos.imports'
import { nextCosmosPage, nextCosmosStaticParams } from 'react-cosmos-next'

export const generateStaticParams = nextCosmosStaticParams(cosmosImports)

export default nextCosmosPage(cosmosImports)
