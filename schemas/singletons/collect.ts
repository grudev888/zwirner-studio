import {ComposeIcon, SearchIcon} from '@sanity/icons'
import {BlockElementIcon} from '@sanity/icons'
import {StringRule, defineArrayMember, defineField, defineType} from 'sanity'
import * as DzHero from '../objects/page/components/molecules/dzHero'
import dzConsignment from '../objects/page/components/molecules/dzConsignment'
import dzInterstitial from '../objects/page/components/molecules/dzInterstitial'
import exhibition from '../documents/exhibition'
import artwork from '../documents/artwork'

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
      ...DzHero.builder([exhibition]),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'exhibitionCarousel',
      group: 'content',
      type: 'array',
      title: 'Exhibition Carousel',
      of: [
        defineArrayMember({
          type: 'reference',
          title: 'Exhibitions and Fairs',
          to: {type: exhibition.name},
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fairCarousel',
      type: 'array',
      group: 'content',
      title: 'Fair Carousel',
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
      title: 'Featured Artworks Grid',
      group: 'content',
      validation: (rule) => rule.required(),
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
      title: 'Utopia Feature',
      name: 'utopiaFeature',
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
      type: dzInterstitial.name,
      title: 'Platform Interstitial',
      name: 'platformInterstitial',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: dzInterstitial.name,
      title: 'Interstitial',
      name: 'interstitial',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
  ],
})
