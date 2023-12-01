import { z } from 'zod'
import type { jsonSchema } from './json.ts'

// zod_utilz
// https://github.com/JacobWeisenburger/zod_utilz/blob/main/src/stringToJSON.ts

export const stringToJsonSchema = z.string().transform((str, ctx): z.infer<typeof jsonSchema> => {
  try {
    return JSON.parse(str)
  } catch (e) {
    ctx.addIssue({ code: 'custom', message: 'Invalid JSON' })
    return z.NEVER
  }
})

/*
zu.stringToJSON() is a schema that validates JSON encoded as a string, then returns the parsed value

schema.parse( 'true' ) // true
schema.parse( 'null' ) // null
schema.parse( '["one", "two", "three"]' ) // ['one', 'two', 'three']
schema.parse( '<html>not a JSON string</html>' ) // throws
*/
