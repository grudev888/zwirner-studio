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
import event from './event'
import * as Interstitial from '../objects/page/components/primitives/interstitial'
import fairPage from './pages/fairPage'
import exhibitionPage from './pages/exhibitionPage'
import {builder as slugBuilder} from '../objects/utils/slugUrl'
import * as Media from '../objects/utils/media'
import {GreyFootNote, GreyFootNoteDecorator} from '../../components/block/GreyFootnote'

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
      type: 'text',
      name: 'description',
      title: 'Description',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: 'date',
      title: 'Date',
      name: 'date',
      validation: (rule) => rule.required(),
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
          // if context.parent.type === 'internalNews' then prefix is /news/[year]/[slug]
         
          // if context.parent.type === 'externalNews' then return null

           // if context.parent.type === 'pressRelease' then prefix is /artists/[artistPageSlug]/press/[slug]
          
          prefix: async (parent, client) => {
            const year = new Date(parent.date).getFullYear()
            const newsPrefix = `/news/${year}`
            const pressId = parent.id
            // look for artistPage slug with guide._ref || selectedPress._ref || guideSubpage._ref || pressSubpage._ref === parent.id 
            const artistPageSlug = await client.fetch(`*[_type == "artistPage" && guideSubpage._ref == "${pressId}"][0].slug.current`)
            const pressPrefix = `${artistPageSlug}/press`
            const defaultPrefix = parent.type === 'internalNews' ? newsPrefix : pressPrefix
            return defaultPrefix
          },
        },
      )
    ),
    defineField(
      Media.builder(
        {
          name: 'image',
          title: 'Header Image',
          group: 'content',
        },
        {type: Media.MediaTypes.IMAGE, required: true}
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
      hidden: (context) => context.parent.type === 'externalNews',
    }),
    defineField({
      type: 'reference',
      group: 'content',
      name: 'event',
      title: 'Event',
      hidden: (context) => context.parent.type === 'externalNews',
      to: [{type: event.name, title: 'Event'}],
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
