import {SchemaTypeDefinition, defineField, defineType} from 'sanity'
import artwork from '../../../../documents/artwork'

const fields = (reference?: SchemaTypeDefinition) => [
  defineField({name: 'title', type: 'string', title: 'Title'}),
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

export default defineType({
  name: 'carouselModule',
  type: 'object',
  fields: [...fields(artwork)],
})
