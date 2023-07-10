import {SchemaTypeDefinition, defineArrayMember, defineField, defineType, isArray} from 'sanity'
import artwork from '../../../../documents/artwork'

const fields = (reference: SchemaTypeDefinition | SchemaTypeDefinition[]) => {
  const references = isArray(reference) ? reference : [reference]

  return [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'displayNumberOfResults',
      type: 'boolean',
      title: 'Display # of results',
      initialValue: false,
    }),
    defineField({
      name: 'itemsPerRow',
      title: 'Max items per row',
      type: 'number',
      initialValue: 4,
      options: {layout: 'dropdown', list: [1, 2, 3, 4]},
    }),
    ...(references
      ? [
          defineField({
            name: 'items',
            type: 'array',
            title: references.map(({title}) => title).join(', '),
            of: references.map((ref) =>
              defineArrayMember({
                type: 'reference',
                title: ref.title,
                name: ref.name,
                to: [{type: ref.name}],
              })
            ),
          }),
        ]
      : []),
  ]
}

export const builder = (
  params: {name: string; title: string; [key: string]: any},
  options?: {reference?: SchemaTypeDefinition | SchemaTypeDefinition[]; excludedFields?: string[]}
) => {
  return {
    type: 'object',
    fields: fields(options?.reference || artwork).filter(
      (field) => !options?.excludedFields?.includes?.(field.name)
    ),
    ...params,
  }
}

export default defineType({
  name: 'gridModule',
  type: 'object',
  fields: fields(artwork),
})
