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
import fairPage from './pages/fairPage'
import exhibitionPage from './pages/exhibitionPage'
import {builder as slugBuilder} from '../objects/utils/slugUrl'
import * as Media from '../objects/utils/media'
import {GreyFootNote, GreyFootNoteDecorator} from '../../components/block/GreyFootnote'
import {ConditionalProperty} from 'sanity'
import blockContentSimple from '../objects/utils/blockContentSimple'

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
        list: [
          {title: 'Press', value: 'Press'},
          {title: 'News', value: 'News'},
          {title: 'Event', value: 'Event'},
          {title: 'Exhibition', value: 'Exhibition'},
          {title: 'Museum Highlights', value: 'Museum Highlights'},
        ],
      },
      initialValue: 'News',
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
    defineField(
      Media.builder(
        {
          name: 'image',
          title: 'Header Image',
          group: 'content',
          hidden: hideForTypes([ArticleTypes['External News'], ArticleTypes['Selected Press']]),
        },
        {type: Media.MediaTypes.IMAGE},
      ),
    ),
    defineField({
      name: 'header',
      title: 'Header Image',
      type: 'array',
      hidden: hideForTypes([ArticleTypes['Guide/Internal News']]),
      of: [
        defineArrayMember(
          Media.builder(
            {name: 'headerImage', title: 'Image', group: 'content'},
            {type: Media.MediaTypes.IMAGE},
          ),
        ),
        defineArrayMember(
          Media.builder(
            {name: 'headerVideo', title: 'Video', group: 'content'},
            {type: Media.MediaTypes.VIDEO},
          ),
        ),
      ],
      group: 'content',
    }),
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
          Media.builder(
            {
              name: 'bodyImage',
              icon: ImageIcon,
              title: 'Image',
              preview: {select: {media: 'image', title: 'image.caption'}},
            },
            {
              type: Media.MediaTypes.IMAGE,
              image: {
                additionalFields: [
                  defineField({
                    type: 'string',
                    name: 'caption',
                    title: 'Caption',
                  }),
                ],
              },
            },
          ),
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
          to: [{type: 'article'}, {type: exhibitionPage.name}, {type: fairPage.name}],
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
          prefix: async (parent, client) => {
            // if parent.type === 'pressRelease' then prefix is /artists/[artist]/press/[slug]
            if (parent.type === ArticleTypes['Selected Press']) {
              const postId = parent._id.startsWith('drafts.')
                ? parent._id.split('.')[1]
                : parent._id
              const artistPageSlug = await client.fetch(
                `coalesce(*[_type == "artistPage" && references("${postId}")]{"slug": slug.current})[0]`,
              )
              if (!artistPageSlug) {
                throw new Error(`No artistPage document references the post with ID: ${parent._id}`)
              } else {
                const pressPrefix = `${artistPageSlug.slug}/press`
                return pressPrefix
              }
            }

            // if context.parent.type === 'internalNews' then prefix is /news/[year]/[slug]
            if (parent.type === ArticleTypes['Guide/Internal News']) {
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
    },
    prepare({title, image}) {
      return {title, media: image?.image ?? DocumentTextIcon}
    },
  },
})
