import {ComposeIcon, EditIcon, MasterDetailIcon} from '@sanity/icons'
import {
  defineField,
  defineType,
  SchemaTypeDefinition,
  defineArrayMember,
  ObjectDefinition,
} from 'sanity'
import blockContentSimple from '../../../utils/blockContentSimple'
import * as Video from '../../../utils/video'
import * as Media from '../../../utils/media'

type ReferenceOptions = {[key: string]: string}

export const builder = (
  params: {name: string; title: string; [key: string]: any} = {
    name: 'dzCard',
    title: 'Card',
  },
  options: {
    references: SchemaTypeDefinition[]
    video?: Video.MediaOptions
    referencesFilter?: ReferenceOptions
  },
) => ({
  type: 'object',
  icon: MasterDetailIcon,
  groups: [
    {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
    {name: 'overrides', title: 'Overrides', icon: EditIcon},
  ],
  fields: [
    defineField({
      type: 'string',
      name: 'bookVariation',
      group: 'content',
      title: 'Book Card type',
      options: {
        list: [
          {title: 'Product card Book', value: 'productCard'},
          {title: 'Content card Book', value: 'contentCard'},
        ],
      },
      // On book types attached, select Book Card type
      hidden: ({parent}) => {
        return parent?.content?.[0]?._type !== 'book'
      },
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Component title',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: 'string',
      name: 'pressVariation',
      group: 'content',
      title: 'Press Variation',
      options: {
        list: [
          {title: 'Selected Press', value: 'selectedPress'},
          {title: 'Press Article', value: 'pressArticle'},
        ],
      },
      // On article types attached, select Press Variation
      hidden: ({parent}) => {
        return parent?.content?.[0]?._type !== 'article'
      },
    }),

    // (Content card) Supported Modules for “Moving Images” ONLY
    defineField(
      Media.builder(
        {
          name: 'mediaOverride',
          title: 'Card Media Override',
          group: 'overrides',
        },
        {
          video: {type: Video.MediaTypes.MOVING_IMAGE},
        },
      ),
    ),

    defineField({
      name: 'secondaryTitle',
      title: 'Secondary Title',
      description:
        'This will override the secondary title for selected press variation on press articles.',
      type: 'string',
      group: 'overrides',
      // Secondary Title (for selected press variation)
      hidden: ({parent}) => {
        return parent?.content?.[0]?._type !== 'article'
      },
    }),
    defineField({
      name: 'primarySubtitle',
      title: 'Primary Subtitle',
      type: 'string',
      group: 'overrides',
    }),
    defineField({
      name: 'secondarySubtitle',
      title: 'Secondary Subtitle',
      description: 'This will override the secondary subtitle for news articles only.',
      type: 'string',
      group: 'overrides',
    }),
    defineField({
      name: 'additionalInformation',
      title: 'Additional Information',
      group: 'overrides',
      type: 'array',
      of: blockContentSimple,
    }),
    defineField({
      name: 'primaryCTA',
      title: 'Primary CTA',
      type: 'cta',
      group: 'overrides',
    }),
    defineField({
      name: 'secondaryCTA',
      title: 'Secondary CTA',
      type: 'cta',
      group: 'overrides',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      group: 'content',
      icon: MasterDetailIcon,
      validation: (rule) => rule.max(1),
      of: options.references.map((reference) => {
        const filterForReference = options?.referencesFilter?.[reference.name]
        const extraOptions = filterForReference ? {options: {filter: filterForReference}} : {}
        return defineArrayMember({
          name: reference.name,
          title: reference.title,
          type: 'reference',
          to: [{type: reference.name}],
          ...extraOptions,
        })
      }),
    }),
    defineField({
      name: 'enableOverrides',
      type: 'boolean',
      title: 'Enable Overrides',
      group: 'overrides',
      initialValue: false,
    }),
  ],
  ...params,
})

export default defineType(
  builder(
    {name: 'dzCard', title: 'Card'},
    {references: [], video: {type: Video.MediaTypes.MOVING_IMAGE}},
  ),
) as ObjectDefinition
