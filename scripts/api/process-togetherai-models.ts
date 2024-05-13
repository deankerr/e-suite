import fs from 'node:fs/promises'

import togetherAiModels from './togetherai-models-data.json'

async function main() {
  const models = togetherAiModels
    .map((model) => {
      if (!model.isFeaturedModel) return null
      return {
        model_id: model.name,
        name: model.display_name,
        creatorName: model.creator_organization,
        type: model.display_type,
        contextLength: model.context_length,
        config: model.config,
        metadata: {
          priceInput: model.pricing.input,
          priceOutput: model.pricing.output,
          description: model.description,
          link: model.link,
          license: model.license,
          numParameters: model.num_parameters,
        },
      }
    })
    .filter((m) => m !== null)
  console.log(models.length, 'items')
  await fs.writeFile('scripts/togetherai-models-output.json', JSON.stringify(models, null, 2))
}

main()
  .then(() => console.log('done'))
  .catch((error) => console.error(error))
