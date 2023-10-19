import {ComposeIcon, EditIcon, SplitVerticalIcon, MasterDetailIcon} from '@sanity/icons'
//Todo import form the design system import {SplitTypes} from '@zwirner/design-system'
import {
  defineField,
  defineArrayMember,
  defineType,
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

type DzSplitBuilderOptions = {
  references: SchemaTypeDefinition[]
  hideComponentTitle?: boolean
  showAsPlainComponent?: boolean
}

const getOptionalProperty = (data: any, options: DzSplitBuilderOptions) => {
  return !options?.showAsPlainComponent ? data : {}
}

export const builder = (
  params: {name: string; title: string; [key: string]: any} = {
    name: 'dzSplit',
    title: 'Split',
  },
  options: DzSplitBuilderOptions,
) => ({
  type: 'object',
  icon: SplitVerticalIcon,
  ...getOptionalProperty(
    {
      groups: [
        {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
        {name: 'overrides', title: 'Overrides', icon: EditIcon},
      ],
    },
    options,
  ),
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Component title',
      ...getOptionalProperty({group: 'content'}, options),
      initialValue: 'Split',
      hidden: () => options.hideComponentTitle ?? false,
    }),

    defineField({
      name: 'content',
      title: 'Content',
      ...getOptionalProperty({group: 'content'}, options),
      type: 'array',
      icon: MasterDetailIcon,
      hidden: () => options?.showAsPlainComponent,
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
      ...getOptionalProperty({group: 'content'}, options),
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
      ...getOptionalProperty({group: 'content'}, options),
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'enableOverrides',
      type: 'boolean',
      title: 'Enable Overrides',
      ...getOptionalProperty({group: 'overrides'}, options),
      initialValue: false,
    }),
    // (Split) Modules to support both “Moving Images” and “Interactive Video”
    defineField(
      Media.builder(
        {
          name: 'media',
          title: 'Media',
          description: 'Media module',
          ...getOptionalProperty({group: 'overrides'}, options),
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
      ...getOptionalProperty({group: 'overrides'}, options),
    }),
    defineField({
      name: 'subtitleOverride',
      type: 'text',
      title: 'Component subtitle',
      ...getOptionalProperty({group: 'overrides'}, options),
    }),
    defineField({
      name: 'primaryCTA',
      title: 'Primary CTA',
      type: 'cta',
      ...getOptionalProperty({group: 'overrides'}, options),
    }),
  ],
  ...params,
})

export default defineType(
  builder({name: 'dzSplit', title: 'Split'}, {references: []}),
) as ObjectDefinition
