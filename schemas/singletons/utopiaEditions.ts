import {ComposeIcon, SearchIcon} from '@sanity/icons'
import {BlockElementIcon} from '@sanity/icons'
import {ObjectRule, defineArrayMember, defineField, defineType} from 'sanity'
import artwork from '../documents/artwork'
import seo from '../objects/page/seo'
import * as Media from '../objects/utils/media'
import exhibitionPage from '../documents/pages/exhibitionPage'
import {defineGridField} from '../common/fields'
import dzInterstitial from '../objects/page/components/molecules/dzInterstitial'

export default defineType({
  name: 'utopiaEditions',
  title: 'Utopia Editions',
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
      type: seo.name,
      group: 'seo',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      ...Media.builder([Media.VIDEO_PROVIDERS.custom]),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'newReleasesInterstitial',
      type: dzInterstitial.name,
      title: 'Interstitial',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'nowAvailable',
      type: 'object',
      title: 'Now Available Carousel',
      validation: (rule: ObjectRule) => rule.required(),
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          initialValue: 'Now Available from Utopia Editions',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'exhibitions',
          type: 'array',
          title: 'Exhibitions',
          of: [{type: 'reference', title: 'Exhibition', to: [{type: exhibitionPage.name}]}],
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'comingSoon',
      type: 'object',
      title: 'Coming Soon Carousel',
      validation: (rule: ObjectRule) => rule.required(),
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          initialValue: 'Coming Soon From Utopia Editions',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'exhibitions',
          type: 'array',
          title: 'Exhibitions',
          of: [{type: 'reference', title: 'Exhibition', to: [{type: exhibitionPage.name}]}],
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineGridField({
      name: 'artworksGrid',
      type: 'object',
      title: 'Grid',
      validation: (rule: ObjectRule) => rule.required(),
      fields: [
        defineField({
          name: 'Title',
          title: 'Title',
          type: 'string',
          initialValue: 'Browse Prints from Utopia Editions',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'artworks',
          title: 'Artworks',
          type: 'array',
          of: [defineArrayMember({type: 'reference', title: 'Artwork', to: {type: artwork.name}})],
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'interstitial',
      title: 'Interstitial',
      type: dzInterstitial.name,
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mediaCarousel',
      title: 'Carousel',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          preview: {select: {title: 'caption', media: 'media.image'}},
          fields: [
            defineField({type: Media.default.name, name: 'media', title: 'Media'}),
            defineField({type: 'string', title: 'Caption', name: 'caption'}),
          ],
        }),
      ],
    }),
  ],
})
