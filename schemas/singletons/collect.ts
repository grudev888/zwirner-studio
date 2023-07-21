import {ComposeIcon, SearchIcon} from '@sanity/icons'
import {BlockElementIcon} from '@sanity/icons'
import {ArrayRule, StringRule, defineArrayMember, defineField, defineType} from 'sanity'
import dzConsignment from '../objects/page/components/molecules/dzConsignment'
import exhibitionPage from '../documents/pages/exhibitionPage'
import artwork from '../documents/artwork'
import interstitial from '../objects/page/components/primitives/interstitial'
import {builder as carouselBuilder} from '../objects/page/components/modules/carouselModule'
import exhibitionPage from '../documents/pages/exhibitionPage'

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
    defineField({
      name: 'hero',
      group: 'content',
      type: 'array',
      title: 'Hero',
      description: 'Hero section',
      of: [
        defineArrayMember({
          type: 'reference',
          title: 'Exhibitions',
          to: [{type: 'exhibitionPage'}, {type: 'fairPage'}],
        }),
      ],
      validation: (rule: ArrayRule<any>) => rule.required().length(1),
    }),
    defineField(
      carouselBuilder(
        {
          name: 'exhibitions',
          group: 'content',
          title: 'Exhibitions',
          description: 'Carousel module',
          validation: (rule: ArrayRule<any>) => rule.required(),
        },
        {reference: [exhibition, exhibitionPage], excludedFields: ['title']}
      )
    ),
    defineField(
      carouselBuilder(
        {
          name: 'fairs',
          group: 'content',
          title: 'Fairs',
          description: 'Carousel module',
        },
        {reference: [exhibition, exhibitionPage], excludedFields: ['title']}
      )
    ),
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
