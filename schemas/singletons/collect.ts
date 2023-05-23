import {ComposeIcon, SearchIcon} from '@sanity/icons'
import {BlockElementIcon} from '@sanity/icons'
import {ArrayRule, ObjectRule, StringRule, defineArrayMember, defineField, defineType} from 'sanity'
import * as Hero from '../objects/page/components/hero'
import dzConsignment from '../objects/page/components/molecules/dzConsignment'
import exhibition from '../documents/exhibition'
import artwork from '../documents/artwork'
import interstitial from '../objects/page/components/interstitial'

export default defineType({
  name: 'collect',
  title: 'Collect',
  type: 'document',
  icon: BlockElementIcon,
  preview: {select: {title: 'title'}},
  groups: [
    {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
  ],
  fields: [
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule: StringRule) => rule.required(),
    }),
    defineField(
      Hero.builder(
        {
          name: 'hero',
          title: 'Hero',
          description: 'Hero module',
          validation: (rule: ObjectRule) => rule.required(),
        },
        {references: [exhibition as Hero.Reference], excludeFields: ['content']}
      )
    ),
    defineField({
      name: 'exhibitions',
      group: 'content',
      type: 'array',
      title: 'Exhibitions',
      description: 'Carousel module',
      of: [
        defineArrayMember({
          type: 'reference',
          title: 'Exhibitions and Fairs',
          to: {type: exhibition.name},
        }),
      ],
      validation: (rule: ArrayRule<any>) => rule.required(),
    }),
    defineField({
      name: 'fairs',
      type: 'array',
      group: 'content',
      title: 'Fairs',
      description: 'Carousel module',
      validation: (rule) => rule.required(),
      of: [
        defineArrayMember({
          type: 'reference',
          title: 'Exhibitions and Fairs',
          to: {type: exhibition.name},
        }),
      ],
    }),
    defineField({
      name: 'featuredArtworks',
      type: 'array',
      title: 'Featured Artworks',
      description: 'Grid module',
      group: 'content',
      validation: (rule: ArrayRule<any>) => rule.required(),
      of: [
        defineArrayMember({
          type: 'reference',
          title: 'Artworks',
          to: {type: artwork.name},
        }),
      ],
    }),
    defineField({
      type: 'object',
      name: 'consignmentsFeature',
      group: 'content',
      title: 'Consignments Feature',
      fields: [
        defineField({
          type: 'string',
          name: 'title',
          title: 'Title',
          validation: (rule) => rule.required(),
        }),
        defineField({
          type: 'text',
          name: 'content',
          title: 'Content',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'consignments',
          title: 'Consignments',
          type: dzConsignment.name,
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      type: 'object',
      name: 'utopiaFeature',
      title: 'Utopia Feature',
      description: 'Split module',
      group: 'content',
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          type: 'image',
          name: 'image',
          title: 'Image',
          validation: (rule) => rule.required(),
        }),
        defineField({
          type: 'string',
          title: 'Title',
          name: 'title',
          validation: (rule) => rule.required(),
        }),
        defineField({
          type: 'text',
          name: 'text',
          title: 'Text',
          validation: (rule) => rule.required(),
        }),
        defineField({
          type: 'url',
          name: 'url',
          title: 'URL',
          validation: (rule) => rule.required().uri({allowRelative: true}),
        }),
      ],
    }),
    defineField({
      type: interstitial.name,
      title: 'Platform Interstitial',
      name: 'platformInterstitial',
      description: 'Interstitial module',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: interstitial.name,
      title: 'Interstitial',
      name: 'interstitial',
      description: 'Interstitial module',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
  ],
})
