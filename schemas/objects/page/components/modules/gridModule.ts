import {SchemaTypeDefinition, defineArrayMember, defineField, isArray} from 'sanity'
import {defineGridField} from '../../../../common/fields'
import artwork from '../../../../documents/artwork'

const fields = (reference: SchemaTypeDefinition | SchemaTypeDefinition[]) => {
  const references = isArray(reference) ? reference : [reference]

  return [
    defineField({
      name: 'Title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    ...(references
      ? [
          defineField({
            name: 'item',
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
            validation: (rule) => rule.required(),
          }),
        ]
      : []),
  ]
}

export const builder = (
  params: {name: string; title: string; [key: string]: any},
  options?: {reference?: SchemaTypeDefinition | SchemaTypeDefinition[]}
) => {
  return defineGridField({
    type: 'object',
    fields: fields(options?.reference || artwork),
    ...params,
  })
}

export default defineGridField({
  name: 'gridModule',
  type: 'object',
  fields: fields(artwork),
})
