import {MasterDetailIcon} from '@sanity/icons'
// Todo: import from the design system import {EditorialType} from '@zwirner/design-system'
import {
  defineArrayMember,
  defineField,
  defineType,
  ObjectDefinition,
  SchemaTypeDefinition,
} from 'sanity'

export const EDITORIAL_TYPES = {
  SIMPLE: 'simple',
  COMPLEX: 'complex',
  QUOTE: 'quote',
}

export const EDITORIAL_TYPES_NAMES = [
  EDITORIAL_TYPES.SIMPLE,
  EDITORIAL_TYPES.COMPLEX,
  EDITORIAL_TYPES.QUOTE,
] as const

export type EditorialType = (typeof EDITORIAL_TYPES_NAMES)[number]

const getContentForMolecule = (options: {references: SchemaTypeDefinition[]}) => {
  if (!options.references.length) return []
  return [
    {
      name: 'content',
      title: 'Editorial Content',
      type: 'array',
      icon: MasterDetailIcon,
      validation: (rule: any) => rule.max(1),
      of: options.references.map((reference) =>
        defineArrayMember({
          name: reference.name,
          title: reference.title,
          type: 'reference',
          to: [{type: reference.name}],
        }),
      ),
    },
  ]
}

export const builder = (
  params: {name: string; title: string; [key: string]: any} = {
    name: 'dzEditorial',
    title: 'Editorial',
  },
  options: {references: SchemaTypeDefinition[]},
) => ({
  type: 'object',
  icon: MasterDetailIcon,
  preview: {select: {title: 'title'}},
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Component title',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Type',
      name: 'editorialType',
      type: 'string',
      options: {
        list: [
          {title: 'Simple', value: 'simple'},
          {title: 'Complex', value: 'complex'},
          {title: 'Quote', value: 'quote'},
        ],
      },
      initialValue: 'simple',
      validation: (rule) => rule.required(),
    }),
    ...getContentForMolecule(options),
    defineField({
      name: 'quoteTitle',
      type: 'string',
      title: 'Quote Title',
      hidden: ({parent}) => parent?.editorialType !== 'quote',
    }),
    defineField({
      name: 'quoteFootNote',
      type: 'string',
      title: 'Quote Footnote',
      hidden: ({parent}) => parent?.editorialType !== 'quote',
    }),
    defineField({
      name: 'editorialTextOverrides',
      title: 'Text Content',
      type: 'array',
      of: [{type: 'textComplex'}],
      hidden: ({parent}) => parent?.editorialType === 'quote',
    }),
    defineField({
      name: 'reverse',
      title: 'Reverse',
      type: 'boolean',
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'imageOverride',
      type: 'image',
      title: 'Image',
      hidden: ({parent}) => parent?.editorialType !== 'complex',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        },
        {
          name: 'url',
          type: 'string',
          title: 'Url redirect',
        },
      ],
    }),
  ],
  ...params,
})

export default defineType(
  builder({name: 'dzEditorial', title: 'Editorial'}, {references: []}),
) as ObjectDefinition
