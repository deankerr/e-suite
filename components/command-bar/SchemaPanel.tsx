import { ScrollArea } from '@radix-ui/themes'
import { useAtom } from 'jotai'

import { localSchema, simpleSchema } from '@/convex/inferenceSchema'
import { modelSelectedAtom } from './atoms'

import type { ZodTypeAny } from 'zod'

type SchemaPanelProps = { props?: unknown }

export const SchemaPanel = ({}: SchemaPanelProps) => {
  const [modelSelected] = useAtom(modelSelectedAtom)
  const [provider, model] = modelSelected.split(':')

  // const schema = provider && model ? getSchema(provider, model) : undefined
  const schema = simpleSchema
  return (
    <ScrollArea>
      <div className="space-y-4">
        {schema &&
          Object.entries(schema).map(([key, values]) => {
            console.log(values)
            return (
              <div key={key} className="grid gap-0.5 font-mono text-xs">
                {key}
                <div className="grid grid-cols-2 gap-1">
                  <pre className="overflow-x-auto bg-gray-1 px-2">
                    {JSON.stringify(values, null, 2)}
                  </pre>
                  <div>{readZod(values)}</div>
                </div>
              </div>
            )
          })}
      </div>
    </ScrollArea>
  )
}

const getSchema = (provider: string, model_id: string) => {
  if (provider === 'sinkin') return localSchema.sinkin.textToImage

  return model_id in localSchema.fal
    ? localSchema.fal[model_id as keyof typeof localSchema.fal]
    : undefined
}

const readZod = (zod: ZodTypeAny) => {
  return '?'
}
