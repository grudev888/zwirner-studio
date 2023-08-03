import {ComposeIcon, EditIcon, MasterDetailIcon} from '@sanity/icons'
import {
  defineField,
  defineType,
  ObjectDefinition,
  defineArrayMember,
  SchemaTypeDefinition,
} from 'sanity'
import artist from '../../../../documents/artist'
import artwork from '../../../../documents/artwork'
import exhibitionPage from '../../../../documents/pages/exhibitionPage'

export interface DzInterstitialTypeProps {
  title: string
  split: boolean
  imageOverride?: any
  enableOverrides: boolean
}

export const builder = (
  params: {name: string; title: string; [key: string]: any} = {
    name: 'dzInterstitial',
    title: 'Interstitial',
  },
  options: {references: SchemaTypeDefinition[]}
) => ({
  type: 'object',
  icon: MasterDetailIcon,
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
    }),
    defineField({
      name: 'split',
      title: 'Split',
      type: 'boolean',
      group: 'content',
      initialValue: false,
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
      name: 'titleOverride',
      type: 'string',
      title: 'Component title',
      group: 'overrides',
    }),
    defineField({
      name: 'ctaOverride',
      type: 'string',
      title: 'CTA title',
      group: 'overrides',
    }),
    defineField({
      name: 'subtitleOverride',
      type: 'string',
      title: 'Component subtitle',
      group: 'overrides',
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
  builder(
    {name: 'dzInterstitial', title: 'Interstitial'},
    {references: [artist, artwork, exhibitionPage]}
  )
) as ObjectDefinition
