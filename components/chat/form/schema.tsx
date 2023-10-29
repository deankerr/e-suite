import { z } from 'zod'

const max_tokens_max = 4097

const formSchema = z.object({
  //* meta
  fieldsEnabled: z.string().array(),
  engineId: z.string().nonempty(),

  //* inference params
  // model: z.string().nonempty(), //* set externally
  // stream: z.boolean().optional(), //* set externally (currently always on)
  // logit_bias - need tokenizer
  // n - ui for multiple responses?
  temperature: z.coerce.number().gte(0).lte(2),
  frequency_penalty: z.coerce.number().gte(-2).lte(2),
  presence_penalty: z.coerce.number().gte(-2).lte(2),
  max_tokens: z.coerce.number().gte(1).lte(max_tokens_max),
  top_p: z.coerce.number().gte(0).lte(2).step(0.01),
  stop: z.string().array(),

  message: z.string().nonempty(),
})

const inputValues = {
  temperature: {
    min: 0,
    max: 2,
    step: 0.01,
  },
  frequency_penalty: {
    min: -2,
    max: 2,
    step: 0.01,
  },
  presence_penalty: {
    min: -2,
    max: 2,
    step: 0.01,
  },
  max_tokens: {
    min: 1,
    max: max_tokens_max,
    step: 1,
  },
  top_p: {
    min: 0,
    max: 2,
    step: 0.01,
  },
}

const defaultValues = {
  fieldsEnabled: [],
  engineId: '',
  temperature: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  max_tokens: max_tokens_max,
  top_p: 1,
  stop: [],
  message: '',
}

export type ChatFormSchemaOpenAI = z.infer<typeof chatFormOpenAI.formSchema>

export const chatFormOpenAI = {
  formSchema,
  inputValues,
  defaultValues,
}
