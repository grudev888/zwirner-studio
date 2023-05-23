import {ObjectRule, defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentTextIcon, ComposeIcon, SearchIcon, ImageIcon} from '@sanity/icons'

import location from './location'
import event from './event'
import * as Interstitial from '../objects/page/components/primitives/interstitial'
import exhibition from './exhibition'
import page from './page'
import fairPage from './pages/fairPage'
import artist from './artist'
import artwork from './artwork'
import * as Media from '../objects/utils/media'

export interface ArticleSchema {
  title?: string
  images?: any
  author?: any
  publisherName?: string
  description?: string
  publisherLogo?: string
}

export default defineType({
  type: 'document',
  name: 'article',
  title: 'Article',
  icon: DocumentTextIcon,
  groups: [
    {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
  ],
  fields: [
    defineField({
      type: 'seo',
      name: 'seo',
      title: 'SEO',
      group: 'seo',
    }),
    defineField({
      type: 'string',
      name: 'title',
      title: 'Title',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slugUrl',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: 'string',
      name: 'type',
      group: 'content',
      title: 'Article type',
      validation: (rule) => rule.required(),
      options: {
        list: [
          {title: 'Internal news', value: 'internal-news'},
          {title: 'Press release', value: 'press-release'},
          {title: 'External news', value: 'external-news'},
        ],
      },
    }),
    defineField(
      Media.builder(
        {
          name: 'image',
          title: 'Header Image',
          group: 'content',
          validation: (rule: ObjectRule) => rule.required(),
        },
        {type: Media.MEDIA_TYPES.IMAGE}
      )
    ),
    defineField({
      name: 'body',
      title: 'Article body',
      group: 'content',
      type: 'array',
      validation: (rule) => rule.required(),
      of: [
        defineArrayMember({type: 'block', name: 'block'}),
        defineArrayMember(
          Media.builder(
            {
              name: 'bodyImage',
              icon: ImageIcon,
              title: 'Image',
              preview: {select: {media: 'image', title: 'image.caption'}},
              validation: (rule: ObjectRule) => rule.required(),
            },
            {
              type: Media.MEDIA_TYPES.IMAGE,
              image: {
                additionalFields: [
                  defineField({
                    type: 'string',
                    name: 'caption',
                    title: 'Caption',
                    validation: (rule) => rule.required(),
                  }),
                ],
              },
            }
          )
        ),
      ],
    }),
    defineField({
      name: 'location',
      title: 'Location',
      group: 'content',
      type: 'reference',
      to: [{type: location.name, title: 'Location'}],
    }),
    defineField({
      type: 'reference',
      group: 'content',
      name: 'event',
      title: 'Event',
      to: [{type: event.name, title: 'Event'}],
    }),
    defineField({
      name: 'pressReleasePDF',
      title: 'Press release PDF',
      group: 'content',
      type: 'file',
      options: {accept: 'application/pdf'},
    }),
    defineField(
      Interstitial.builder(
        {
          name: 'interstitial',
          group: 'content',
          title: 'Interstitial',
        },
        {excludeFields: ['subtitle']}
      )
    ),
    defineField({
      name: 'articles',
      title: 'Linked Articles',
      group: 'content',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'article',
          title: 'Linked article',
          description: 'Articles, exhibitions, fairs, pages, artists, and artworks are allowed',
          type: 'reference',
          to: [
            {type: 'article'},
            {type: exhibition.name},
            {type: page.name},
            {type: fairPage.name},
            {type: artist.name},
            {type: artwork.name},
          ],
        }),
      ],
    }),
  ],
})
