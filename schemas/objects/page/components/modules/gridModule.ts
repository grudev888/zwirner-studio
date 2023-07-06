import {SchemaTypeDefinition, defineField} from 'sanity'
import {defineGridField} from '../../../../common/fields'
import artwork from '../../../../documents/artwork'

const fields = (reference?: SchemaTypeDefinition) => [
  defineField({
    name: 'Title',
    title: 'Title',
    type: 'string',
    validation: (rule) => rule.required(),
  }),
  ...(reference
    ? [
        defineField({
          name: reference.name,
          type: 'array',
          title: reference.title,
          of: [{type: 'reference', title: reference.title, to: [{type: reference.name}]}],
          validation: (rule) => rule.required(),
        }),
      ]
    : []),
]

export const builder = (
  params: {name: string; title: string; [key: string]: any},
  options?: {reference?: SchemaTypeDefinition}
) => {
  return {
    type: 'object',
    fields: fields(options?.reference),
    ...params,
  }
}

export default defineGridField({
  name: 'gridModule',
  type: 'object',
  fields: fields(artwork),
})
