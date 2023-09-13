import {PresentationIcon, ComposeIcon, SearchIcon, InlineIcon} from '@sanity/icons'
import {defineField, defineArrayMember, defineType, StringRule, ArrayRule} from 'sanity'
import articleType from '../documents/article'
import bookType from '../documents/book'
import exhibitionPage from '../documents/pages/exhibitionPage'
import podcast from '../documents/podcast'
import interstitial from '../objects/page/components/primitives/interstitial'
import * as Media from '../objects/utils/media'
import {builder as carouselModuleBuilder} from '../objects/page/components/modules/carouselModule'
import blockContentSimpleWithLinks from '../objects/utils/blockContentSimpleWithLinks'
import { hiddenSlug } from '../objects/data/hiddenSlug'

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
    hiddenSlug,
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
              to: [{type: exhibitionPage.name}],
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
          Media.builder({
            name: 'featuredMedia',
            title: 'Featured Media',
          }),
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
          name: 'text',
          title: 'Text',
          type: 'array',
          validation: (rule) => rule.required(),
          of: blockContentSimpleWithLinks,
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
      name: 'featuredBooks',
      title: 'Featured New Books',
      description: 'Carousel or Split module',
      group: 'content',
      validation: (rule) => rule.max(1).error('Add up to one molecule, Split or Carousel'),
      type: 'array',
      of: [
        defineArrayMember(
          carouselModuleBuilder(
            {
              name: 'carouselBooks',
              icon: InlineIcon,
              title: 'Carousel Module',
              description: 'Featured Books | Carousel',
            },
            {reference: bookType},
          ),
        ),
        defineArrayMember({
          name: 'splitBook',
          title: 'Split module',
          description: 'Featured Book | Split',
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
      validation: (rule) => rule.max(6),
      type: 'array',
      of: [
        defineArrayMember({
          name: 'linkedArticles',
          title: 'Linked Articles',
          description: 'Articles, exhibitions, fairs',
          type: 'reference',
          to: [{type: articleType.name}, {type: exhibitionPage.name}],
        }),
      ],
    }),
    defineField({
      type: interstitial.name,
      title: 'Interstitial',
      name: 'mailingListInterstitial',
      description: 'Interstitial module',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
  ],
})
