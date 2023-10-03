import {
  SlugSourceContext,
  UrlRule,
  defineArrayMember,
  defineField,
  defineType,
  ConditionalPropertyCallbackContext,
  StringRule,
  RuleDef,
  ArrayRule,
} from 'sanity'
import {DocumentTextIcon, ComposeIcon, SearchIcon, ImageIcon} from '@sanity/icons'

import location from './location'
import * as Interstitial from '../objects/page/components/primitives/interstitial'
import exhibitionPage from './pages/exhibitionPage'
import {builder as slugBuilder} from '../objects/utils/slugUrl'
import * as Media from '../objects/utils/media'
import {GreyFootNote, GreyFootNoteDecorator} from '../../components/block/GreyFootnote'
import {ConditionalProperty} from 'sanity'
import blockContentSimple from '../objects/utils/blockContentSimple'
import artwork from './artwork'
import * as dzMedia from '../objects/page/components/molecules/dzMedia'

export interface ArticleSchema {
  title?: string
  images?: any
  author?: any
  publisherName?: string
  description?: string
  publisherLogo?: string
}

export enum ArticleTypes {
  'Guide/Internal News' = 'internalNews',
  'Selected Press' = 'pressRelease',
  'External News' = 'externalNews',
}

export enum ArticleCategory {
  'Press' = 'Press',
  'News' = 'News',
  'Event' = 'Event',
  'Museum Exhibition' = 'Museum Exhibition',
  'Museum Highlights' = 'Museum Highlights',
}

const findKey = (value: ArticleTypes) =>
  Object.keys(ArticleTypes)[Object.values(ArticleTypes).indexOf(value)]

const requireForTypes =
  <T extends RuleDef<T>>(types: ArticleTypes[], asas: string = '') =>
  (rule: T) =>
    rule.custom((value, context) =>
      types.includes((context.parent as any).type) && !!value === false
        ? `This field is required when Article Type is ${types.map(findKey).join(', ')}`
        : true,
    )

const hideForTypes =
  (types: ArticleTypes[]): ConditionalProperty =>
  (context: SlugSourceContext | ConditionalPropertyCallbackContext) =>
    types.includes(context.parent.type)

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
      name: 'type',
      group: 'content',
      title: 'Article Type',
      validation: (rule: StringRule) => rule.required(),
      options: {
        list: Object.entries(ArticleTypes).map(([title, value]) => ({title, value})),
      },
    }),
    defineField({
      type: 'string',
      name: 'category',
      title: 'Category',
      group: 'content',
      options: {
        list: Object.entries(ArticleCategory).map(([title, value]) => ({title, value})),
      },
      hidden: hideForTypes([ArticleTypes['Selected Press']]),
      initialValue: ArticleCategory.News,
    }),
    defineField({
      type: 'string',
      name: 'title',
      title: 'Primary Title',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'externalURL',
      title: 'Override URL',
      group: 'content',
      validation: (rule) => [
        requireForTypes<UrlRule>([ArticleTypes['External News']])(rule),
        rule.custom((value) => {
          if (value && !value.startsWith('https://') && !value.startsWith('http://'))
            return {message: 'URL protocol missing (http:// or https://)'}
          return true
        }),
      ],
      type: 'url',
    }),
    defineField({
      type: 'string',
      name: 'primarySubtitle',
      title: 'Primary Subtitle',
      group: 'content',
    }),
    defineField({
      type: 'string',
      name: 'subtitle',
      title: 'Secondary Title',
      description: 'Displays subtitle/summary text on cards and in search results.',
      validation: requireForTypes<StringRule>([ArticleTypes['Selected Press']]),
      group: 'content',
    }),
    defineField({
      type: 'array',
      name: 'description',
      title: 'Description',
      description: 'Displays text between title and body.',
      group: 'content',
      hidden: hideForTypes([ArticleTypes['Selected Press']]),
      of: blockContentSimple,
    }),
    defineField({
      name: 'header',
      title: 'Header Image',
      type: 'array',
      hidden: hideForTypes([ArticleTypes['External News'], ArticleTypes['Selected Press']]),
      of: [
        defineArrayMember(dzMedia.builder({name: 'headerImage', title: 'Image', group: 'content'})),
        defineArrayMember({
          name: 'artwork',
          title: 'Artwork',
          type: 'reference',
          to: [{type: artwork.name}],
        }),
      ],
      group: 'content',
    }),
    defineField(
      Media.builder(
        {
          name: 'image',
          title: 'Header Image',
          group: 'content',
          hidden: hideForTypes([ArticleTypes['Guide/Internal News']]),
        },
        {type: Media.MediaTypes.IMAGE},
      ),
    ),

    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      group: 'content',
      description:
        'Enter a date associated with the article. The article slug will be generated from this date.',
      type: 'date',
    }),
    defineField({
      name: 'displayDate',
      title: 'Display Date',
      description:
        'This field will override the default display dates used by the date selector below.',
      group: 'content',
      type: 'string',
      hidden: hideForTypes([ArticleTypes['External News']]),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      group: 'content',
      type: 'reference',
      to: [{type: location.name, title: 'Location'}],
      hidden: hideForTypes([ArticleTypes['External News']]),
    }),
    defineField({
      name: 'body',
      title: 'Article Body',
      group: 'content',
      type: 'array',
      validation: requireForTypes<ArrayRule<unknown>>(
        [ArticleTypes['Guide/Internal News'], ArticleTypes['Selected Press']],
        'artiblecobdy',
      ),
      hidden: hideForTypes([ArticleTypes['External News']]),
      of: [
        defineArrayMember({
          type: 'block',
          name: 'block',
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {
                title: 'Grey Note',
                value: 'greyNote',
                icon: GreyFootNote,
                component: GreyFootNoteDecorator,
              },
            ],
          },
        }),
        defineArrayMember(
          dzMedia.builder({
            name: 'bodyImage',
            icon: ImageIcon,
            title: 'Image',
          }),
        ),
      ],
    }),
    defineField({
      name: 'articles',
      title: 'Related Articles',
      group: 'content',
      hidden: hideForTypes([ArticleTypes['External News']]),
      type: 'array',
      of: [
        defineArrayMember({
          name: 'article',
          title: 'Linked Articles',
          description: 'Articles, exhibitions, fairs',
          type: 'reference',
          weak: true,
          to: [{type: 'article'}, {type: exhibitionPage.name}],
        }),
      ],
    }),
    defineField(
      slugBuilder(
        {
          name: 'slug',
          title: 'Slug',
          group: 'content',
          options: {
            source: (object: any) => {
              const defaultSlug = object?.title
              if (!defaultSlug) throw new Error('Please add a title to create a unique slug.')
              return defaultSlug.slice(0, 95)
            },
          },
          validation: requireForTypes([
            ArticleTypes['Guide/Internal News'],
            ArticleTypes['Selected Press'],
          ]),
          hidden: hideForTypes([ArticleTypes['External News']]),
        },
        {
          optional: true,
          prefix: async (parent) => {
            // if context.parent.type === 'internalNews' or parent.type === 'pressRelease' (Selected Press) then prefix is /news/[year]/[slug]
            if (
              parent.type === ArticleTypes['Guide/Internal News'] ||
              parent.type === ArticleTypes['Selected Press']
            ) {
              if (!parent?.publishDate) {
                throw new Error('Please add a date to create a unique slug.')
              }

              const publishDate = new Date(parent.publishDate)
              if (isNaN(publishDate.getTime())) {
                throw new Error('Please add a valid date to create a unique slug.')
              }

              const year = publishDate.getFullYear()
              const newsPrefix = `/news/${year}`
              return newsPrefix
            }

            return '/'
          },
        },
      ),
    ),
    defineField(
      Interstitial.builder(
        {
          name: 'interstitial',
          group: 'content',
          title: 'Interstitial',
          hidden: hideForTypes([ArticleTypes['External News']]),
        },
        {excludeFields: ['subtitle']},
      ),
    ),
    defineField({
      name: 'pdf',
      title: 'PDF',
      group: 'content',
      type: 'file',
      hidden: hideForTypes([ArticleTypes['External News']]),
      options: {accept: 'application/pdf'},
    }),
  ],
  preview: {
    select: {
      title: 'title',
      image: 'image',
      subtitle: 'subtitle',
      header: 'header',
    },
    prepare: ({title, subtitle, header, image}) => {
      return {
        title,
        subtitle,
        media:
          image?.image ||
          header?.find((el: any) => !!el?.media?.image)?.media?.image ||
          DocumentTextIcon,
      }
    },
  },
})
