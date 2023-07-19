import {
  ConditionalPropertyCallbackContext,
  SlugRule,
  SlugSourceContext,
  defineArrayMember,
  defineField,
  defineType,
} from 'sanity'
import {DocumentTextIcon, ComposeIcon, SearchIcon, ImageIcon} from '@sanity/icons'

import location from './location'
import * as Interstitial from '../objects/page/components/primitives/interstitial'
import fairPage from './pages/fairPage'
import exhibitionPage from './pages/exhibitionPage'
import {builder as slugBuilder} from '../objects/utils/slugUrl'
import * as Media from '../objects/utils/media'
import {GreyFootNote, GreyFootNoteDecorator} from '../../components/block/GreyFootnote'
import dateSelection from '../objects/utils/dateSelection'


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
    // defineField({
    //   type: 'string',
    //   name: 'summary',
    //   title: 'Summary',
    //   description: 'Displays a summary as subtitle text on cards and in search results.',
    //   group: 'content',
    // }),
    defineField({
      type: 'text',
      name: 'description',
      title: 'Description',
      description: 'Displays text between title and body.',
      group: 'content',
    }),
    defineField({
      name: 'displayDate',
      title: 'Display Date',
      description: 'This field will override the default display dates used by the date selector below.',
      group: 'content',
      type: 'string',
    }),
    defineField({
      title: 'Date',
      name: 'dateSelection',
      group: 'content',
      description: 'Sets the year associated with the slug of an article and displays dates associated with the article.',
      type: dateSelection.name,
    }),
    defineField({
      type: 'string',
      name: 'type',
      group: 'content',
      title: 'Article Type',
      validation: (rule) => rule.required(),
      options: {
        list: [
          {title: 'Internal News', value: 'internalNews'},
          {title: 'Press Release', value: 'pressRelease'},
          {title: 'External News', value: 'externalNews'},
          // {title: 'Artist Press', value: 'artistPress'},
        ],
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
        ],
      },
      initialValue: 'News',
    }),
    defineField(
      slugBuilder(
        {
          name: 'slug',
          title: 'Slug',
          group: 'content',
          options: {
            source: (object: any) => {
              const defaultSlug = `${object?.title}` ?? ''
              if (!defaultSlug) throw new Error('Please add a title to create a unique slug.')
              return defaultSlug.slice(0, 95)
            },
            validation: (rule: SlugRule) =>
              rule.custom((value, context) => {
                return (context.parent as any).type !== 'externalNews' && !value ? 'Required' : true
              }),
            hidden: (context: SlugSourceContext) => (context.parent as any).type === 'externalNews',
          },
        },
        {
          optional: true,

          prefix: async (parent, client) => {
            // if parent.type === 'pressRelease' then prefix is /artists/[artist]/press/[slug]
            if (parent.type === 'pressRelease') {
              const postId = parent._id.startsWith('drafts.')
                ? parent._id.split('.')[1]
                : parent._id
              const artistPageSlug = await client.fetch(
                `coalesce(*[_type == "artistPage" && references("${postId}")]{"slug": slug.current})[0]`
              )
              if (!artistPageSlug) {
                throw new Error(`No artistPage document references the post with ID: ${parent._id}`)
              } 
              // else if (artistPageSlug.length > 1) {
              //   throw new Error(
              //     `Multiple artistPage documents reference the post with ID: ${parent._id}`
              //   )
              // } 
              else {
                const pressPrefix = `${artistPageSlug.slug}/press`
                return pressPrefix
              }
            }

            // if context.parent.type === 'internalNews' then prefix is /news/[year]/[slug]
            if (parent.type === 'internalNews') {
              if (!parent?.dateSelection) {
                throw new Error('Please add a date to create a unique slug.')
              }
              let thisDate = new Date()
              if (parent?.dateSelection?.year) {
                thisDate = new Date(parent?.dateSelection?.year, 1)
              } else if (parent?.dateSelection?.dateRange?.from || parent?.dateSelection?.dateRange?.to) {
                thisDate = new Date(parent?.dateSelection?.dateRange.from || parent?.dateSelection?.dateRange.from)
              } else if (parent?.dateSelection?.approximate) {
                thisDate = new Date(parent?.dateSelection?.approximate)
              }

              if (isNaN(thisDate.getTime())) {
                throw new Error('Please add a valid date to create a unique slug.')
              } else {
                const year = thisDate.getFullYear()
                const newsPrefix = `/news/${year}`
                return newsPrefix
              }              
            }

            // if parent.type === 'externalNews' then return empty string
            else {
              return ''
            }
          },
        }
      )
    ),
    defineField(
      Media.builder(
        {
          name: 'image',
          title: 'Header Image',
          group: 'content',
        },
        {type: Media.MediaTypes.IMAGE}
      )
    ),
    defineField({
      name: 'body',
      title: 'Article Body',
      group: 'content',
      type: 'array',
      validation: (rule) =>
        rule.custom((value, context) =>
          (context.parent as any).type !== 'externalNews' && !value ? 'Required' : true
        ),
      hidden: (context) => context.parent.type === 'externalNews',
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
      hidden: (context) => context.parent.type === 'externalNews',
    }),
    defineField({
      name: 'pressReleasePDF',
      title: 'Press Release PDF',
      group: 'content',
      type: 'file',
      hidden: (context) => context.parent.type === 'externalNews',
      options: {accept: 'application/pdf'},
    }),
    defineField(
      Interstitial.builder(
        {
          name: 'interstitial',
          group: 'content',
          title: 'Interstitial',
          hidden: (context: ConditionalPropertyCallbackContext) =>
            context.parent.type === 'externalNews',
        },
        {excludeFields: ['subtitle']}
      )
    ),
    defineField({
      name: 'articles',
      title: 'Linked Articles',
      group: 'content',
      hidden: (context) => context.parent.type === 'externalNews',
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
    defineField({
      name: 'externalURL',
      title: 'External URL',
      group: 'content',
      hidden: (context) => context.parent.type !== 'externalNews',
      validation: (rule) =>
        rule.custom((value, context) => {
          if ((context.parent as any).type === 'externalNews') {
            if (!value) return {message: 'Required'}

            if (!value.startsWith('https://') && !value.startsWith('http://'))
              return {message: 'URL protocol missing (http:// or https://)'}
          }

          return true
        }),
      type: 'url',
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
