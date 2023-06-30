import {PresentationIcon, ComposeIcon, SearchIcon} from '@sanity/icons'
import {defineField, defineArrayMember, defineType, StringRule, ArrayRule} from 'sanity'
import articleType from '../documents/article'
import bookType from '../documents/book'
import exhibitionPage from '../documents/pages/exhibitionPage'
import fairPage from '../documents/pages/fairPage'
import podcast from '../documents/podcast'
import interstitial from '../objects/page/components/primitives/interstitial'
import * as Media from '../objects/utils/media'

export default defineType({
  name: 'stories',
  title: 'Stories',
  type: 'document',
  icon: PresentationIcon,
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
      type: 'object',
      name: 'hero',
      title: 'Hero',
      description: 'Hero section',
      group: 'content',
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'heroReference',
          type: 'array',
          title: 'Hero reference',
          description: 'Exhibition page',
          of: [
            defineArrayMember({
              type: 'reference',
              title: 'Exhibitions',
              to: [{type: exhibitionPage.name}, {type: fairPage.name}],
            }),
          ],
          validation: (rule: ArrayRule<any>) => rule.required().length(1),
        }),
        defineField({
          name: 'heroCta',
          title: 'Hero CTA',
          type: 'cta',
        }),
      ],
    }),
    defineField({
      type: 'object',
      name: 'featuredVideos',
      title: 'Featured Videos',
      description: 'Split video module',
      group: 'content',
      validation: (rule) => rule.required(),
      fields: [
        defineField(
          Media.builder(
            {
              name: 'video',
              title: 'Featured video',
            },
            {type: Media.MediaTypes.VIDEO, required: true}
          )
        ),
        defineField({
          type: 'string',
          title: 'Category',
          name: 'category',
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
          name: 'primaryCTA',
          title: 'CTA',
          type: 'cta',
        }),
      ],
    }),
    defineField({
      name: 'featuredPodcast',
      title: 'Featured Podcast',
      description: 'Split podcast module',
      type: 'reference',
      group: 'content',
      to: [{type: podcast.name}],
    }),
    defineField({
      name: 'books',
      title: 'Featured New Books',
      description: '2-Up feature books module',
      group: 'content',
      validation: (rule) => rule.max(2),
      type: 'array',
      of: [
        defineArrayMember({
          name: 'linkedBooks',
          title: 'Linked Books',
          description: 'Featured new books',
          type: 'reference',
          to: [{type: bookType.name}],
        }),
      ],
    }),
    defineField({
      name: 'articles',
      title: 'News and Press Highlights',
      description: '3-Up News and Press module',
      group: 'content',
      validation: (rule) => rule.max(3),
      type: 'array',
      of: [
        defineArrayMember({
          name: 'linkedArticles',
          title: 'Linked Articles',
          description: 'Articles, exhibitions, fairs',
          type: 'reference',
          to: [{type: articleType.name}, {type: exhibitionPage.name}, {type: fairPage.name}],
        }),
      ],
    }),
    defineField({
      type: interstitial.name,
      title: 'Mailing list Interstitial',
      name: 'mailingListInterstitial',
      description: 'Interstitial module',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
  ],
})
