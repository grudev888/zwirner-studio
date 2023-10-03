import {ComposeIcon, EditIcon, SplitVerticalIcon, MasterDetailIcon} from '@sanity/icons'
//Todo import form the design system import {SplitTypes} from '@zwirner/design-system'
import {
  defineField,
  defineArrayMember,
  defineType,
  ObjectRule,
  ObjectDefinition,
  SchemaTypeDefinition,
} from 'sanity'
import * as Media from '../../../../objects/utils/media'

export const SPLIT_TYPES = {
  TALL: 'tall',
  SHORT: 'short',
}
export const SPLIT_TYPES_NAMES = [SPLIT_TYPES.TALL, SPLIT_TYPES.SHORT] as const
export type SplitTypes = (typeof SPLIT_TYPES_NAMES)[number]
export interface DzSplitTypeProps {
  title: string
  splitType: SplitTypes
  reverse: boolean
  animate: boolean
  imageOverride?: any
  enableOverrides: boolean
}

export const builder = (
  params: {name: string; title: string; [key: string]: any} = {
    name: 'dzSplit',
    title: 'Split',
  },
  options: {references: SchemaTypeDefinition[]},
) => ({
  type: 'object',
  icon: SplitVerticalIcon,
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
      initialValue: 'Split',
    }),
    defineField({
      name: 'content',
      title: 'Content',
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
        }),
      ),
    }),
    defineField({
      title: 'Type',
      name: 'splitType',
      type: 'string',
      group: 'content',
      options: {
        list: [
          {title: 'Tall', value: 'tall'},
          {title: 'Short', value: 'short'},
        ],
      },
      initialValue: 'short',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'reverse',
      title: 'Reverse row',
      type: 'boolean',
      group: 'content',
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'animate',
      title: 'Animate image',
      type: 'boolean',
      group: 'content',
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'enableOverrides',
      type: 'boolean',
      title: 'Enable Overrides',
      group: 'overrides',
      initialValue: false,
    }),
    // (Split) Modules to support both “Moving Images” and “Interactive Video”
    defineField(
      Media.builder(
        {
          name: 'media',
          title: 'Media',
          description: 'Media module',
          group: 'overrides',
          validation: (rule: ObjectRule) => rule.required(),
        },
        {
          // This enables video type selection
          video: {enabledSelection: true},
        },
      ),
    ),
    defineField({
      name: 'titleOverride',
      type: 'string',
      title: 'Component title',
      group: 'overrides',
    }),
    defineField({
      name: 'primaryCTA',
      title: 'Primary CTA',
      type: 'cta',
      group: 'overrides',
    }),
    defineField({
      name: 'subtitleOverride',
      type: 'string',
      title: 'Component subtitle',
      group: 'overrides',
    }),
  ],
  ...params,
})

export default defineType(
  builder({name: 'dzSplit', title: 'Split'}, {references: []}),
) as ObjectDefinition
