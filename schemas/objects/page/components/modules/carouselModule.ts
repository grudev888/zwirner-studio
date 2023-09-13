import {SchemaTypeDefinition, defineArrayMember, defineField, defineType, isArray} from 'sanity'
import artwork from '../../../../documents/artwork'

const fields = (reference: SchemaTypeDefinition | SchemaTypeDefinition[]) => {
  const references = isArray(reference) ? reference : [reference]

  return [
    defineField({
      name: 'size',
      type: 'string',
      title: 'Size',
      options: {list: [{value: 'XL', title: 'XL'}, 'L', 'M', 'S']},
    }),
    defineField({name: 'title', type: 'string', title: 'Title'}),
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
              }),
            ),
            validation: (rule) => rule.max(12),
          }),
        ]
      : []),
  ]
}

export const builder = (
  params: {name: string; title: string; [key: string]: any},
  options: {reference: SchemaTypeDefinition | SchemaTypeDefinition[]; excludedFields?: string[]},
) => {
  return {
    type: 'object',
    fields: fields(options.reference).filter(
      (field) => !options?.excludedFields?.includes?.(field.name),
    ),
    ...params,
  }
}

export default defineType({
  name: 'carouselModule',
  title: 'Carousel Module',
  type: 'object',
  fields: [...fields(artwork)],
})
