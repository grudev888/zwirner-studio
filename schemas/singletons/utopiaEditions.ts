import {ComposeIcon, SearchIcon} from '@sanity/icons'
import {BlockElementIcon} from '@sanity/icons'
import {ObjectRule, defineArrayMember, defineField, defineType} from 'sanity'
import artwork from '../documents/artwork'
import seo from '../objects/page/seo'
import * as Media from '../objects/utils/media'
import exhibitionPage from '../documents/pages/exhibitionPage'
import {defineGridField} from '../common/fields'
import * as Interstitial from '../objects/page/components/primitives/interstitial'
import { hiddenSlug } from '../objects/data/hiddenSlug'

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
    hiddenSlug,
    defineField({
      name: 'seo',
      title: 'SEO',
      type: seo.name,
      group: 'seo',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      group: 'content',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField(
      Media.builder({
        name: 'media',
        title: 'Header Media',
        group: 'content',
        description: 'Media module',
        validation: (rule: ObjectRule) => rule.required(),
      }),
    ),
    defineField(
      Interstitial.builder(
        {
          name: 'newReleasesInterstitial',
          title: 'Introduction',
          group: 'content',
          description: 'Custom Interstitial module',
          validation: (rule: ObjectRule) => rule.required(),
        },
        {excludeFields: ['subtitle']},
      ),
    ),
    defineField({
      name: 'nowAvailable',
      type: 'object',
      title: 'Now Available',
      group: 'content',
      description: 'Carousel module',
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
      title: 'Coming Soon',
      group: 'content',
      description: 'Carousel module',
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
      group: 'content',
      description: 'Grid module',
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
    defineField(
      Interstitial.builder(
        {
          name: 'interstitial',
          title: 'Interstitial',
          description: 'Interstitial module',
          group: 'content',
          validation: (rule: ObjectRule) => rule.required(),
        },
        {excludeFields: ['subtitle']},
      ),
    ),
    defineField({
      name: 'mediaCarousel',
      title: 'Media',
      group: 'content',
      description: 'Carousel module',
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
