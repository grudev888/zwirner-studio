import {ComposeIcon, EditIcon, MasterDetailIcon} from '@sanity/icons'
// Todo: import from the design system import {EditorialType} from '@zwirner/design-system'
import {
  defineArrayMember,
  defineField,
  defineType,
  ObjectDefinition,
  SchemaTypeDefinition,
} from 'sanity'
import book from '../../../../documents/book'
import press from '../../../../documents/press'

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

import {TextComplexSchemaType} from '../../../../../schemas/objects/utils/textComplex'

export interface DzEditorialSchemaProps {
  title: string
  editorialType: EditorialType
  editorialTextOverrides?: TextComplexSchemaType[]
  imageOverride?: any
  enableOverrides: boolean
}

export const builder = (
  params: {name: string; title: string; [key: string]: any} = {
    name: 'dzEditorial',
    title: 'Editorial',
  },
  options: {references: SchemaTypeDefinition[]}
) => ({
  type: 'object',
  icon: MasterDetailIcon,
  preview: {select: {title: 'title'}},
  groups: [
    {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
    {name: 'overrides', title: 'Overrides', icon: EditIcon},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Component title',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Type',
      name: 'editorialType',
      type: 'string',
      group: 'content',
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
    defineField({
      name: 'content',
      title: 'Editorial Content',
      group: 'content',
      type: 'array',
      icon: MasterDetailIcon,
      validation: (rule) => rule.max(1),
      of: options.references.map((reference) =>
        defineArrayMember({
          name: reference.name,
          title: reference.title,
          type: 'reference',
          to: [{type: reference.name}],
        })
      ),
    }),
    defineField({
      name: 'enableOverrides',
      type: 'boolean',
      title: 'Enable Overrides',
      group: 'overrides',
      initialValue: false,
    }),
    defineField({
      name: 'editorialTextOverrides',
      title: 'Text Content',
      type: 'array',
      group: 'overrides',
      of: [{type: 'textComplex'}],
    }),
    defineField({
      name: 'imageOverride',
      type: 'image',
      title: 'Image',
      group: 'overrides',
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
  builder({name: 'dzEditorial', title: 'Editorial'}, {references: [book, press]})
) as ObjectDefinition
