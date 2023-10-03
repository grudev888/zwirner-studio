import {MasterDetailIcon, DocumentTextIcon} from '@sanity/icons'
// Todo: import from the design system import {EditorialType} from '@zwirner/design-system'
import {
  defineArrayMember,
  defineField,
  defineType,
  StringRule,
  ObjectDefinition,
  SchemaTypeDefinition,
} from 'sanity'

export const EDITORIAL_TYPES = {
  SIMPLE: 'simple',
  COMPLEX: 'complex',
  QUOTE: 'quote',
}
import * as TextComplex from '../../../utils/textComplex'
import blockContentSimple from '../../../utils/blockContentSimple'

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
  options: {references: SchemaTypeDefinition[]; hideComponentTitle?: boolean} = {
    references: [],
    hideComponentTitle: false,
  },
) => ({
  type: 'object',
  icon: DocumentTextIcon,
  preview: {select: {title: 'title'}},
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Component title',
      ...(!options?.hideComponentTitle ? {validation: (rule: StringRule) => rule.required()} : {}),
      hidden: options?.hideComponentTitle,
      initialValue: 'Editorial',
    }),
    defineField({
      title: 'Type',
      name: 'editorialType',
      type: 'string',
      options: {
        list: [
          {title: 'Simple', value: EDITORIAL_TYPES.SIMPLE},
          {title: 'Complex', value: EDITORIAL_TYPES.COMPLEX},
          {title: 'Quote', value: EDITORIAL_TYPES.QUOTE},
        ],
      },
      initialValue: 'simple',
      validation: (rule) => rule.required(),
    }),
    ...getContentForMolecule(options),
    defineField({
      name: 'quoteTitle',
      type: 'array',
      title: 'Quote Title',
      of: blockContentSimple,
      hidden: ({parent}) => parent?.editorialType !== EDITORIAL_TYPES.QUOTE,
    }),
    defineField({
      name: 'quoteFootNote',
      type: 'array',
      title: 'Quote Footnote',
      of: blockContentSimple,
      hidden: ({parent}) => parent?.editorialType !== EDITORIAL_TYPES.QUOTE,
    }),
    defineField(
      TextComplex.builder(
        {
          name: 'editorialTextOverridesSimple',
          title: 'Text Content',
          hidden: ({parent}: any) => parent?.editorialType !== EDITORIAL_TYPES.SIMPLE,
        },
        {type: TextComplex.ComplexTextTypes.SINGLE},
      ),
    ),
    defineField({
      name: 'editorialTextOverrides',
      title: 'Text Content',
      type: 'array',
      of: [
        TextComplex.builder(
          {
            name: 'editorialTextOverridesComplex',
            title: 'Text Content',
          },
          {type: TextComplex.ComplexTextTypes.FULL},
        ),
      ],
      hidden: ({parent}) => parent?.editorialType !== EDITORIAL_TYPES.COMPLEX,
    }),
    defineField({
      name: 'reverse',
      title: 'Reverse',
      type: 'boolean',
      initialValue: false,
      hidden: ({parent}) => parent?.editorialType !== EDITORIAL_TYPES.COMPLEX,
    }),
    defineField({
      name: 'imageOverride',
      type: 'image',
      title: 'Image',
      hidden: ({parent}) => parent?.editorialType !== EDITORIAL_TYPES.COMPLEX,
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          hidden: true,
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
