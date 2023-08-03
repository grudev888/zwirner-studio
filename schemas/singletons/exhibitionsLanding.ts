import {ComposeIcon, SearchIcon, DocumentIcon} from '@sanity/icons'
import {BlockElementIcon} from '@sanity/icons'
import {StringRule, defineArrayMember, defineField, defineType} from 'sanity'
import exhibitionPage from '../documents/pages/exhibitionPage'
import article from '../documents/article'
import interstitial from '../objects/page/components/primitives/interstitial'
import {builder as PageBuilder, PageBuilderComponents} from '../objects/utils/pageBuilder'

export default defineType({
  name: 'exhibitionsLanding',
  title: 'Exhibitions Landing',
  type: 'document',
  icon: BlockElementIcon,
  preview: {select: {title: 'title'}},
  groups: [
    {name: 'exhibitions', title: 'Exhibitions', icon: ComposeIcon, default: true},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
    {name: 'pastExhibitions', title: 'Past Exhibitions', icon: DocumentIcon},
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
      group: 'exhibitions',
      validation: (rule: StringRule) => rule.required(),
    }),
    // For Page builder the builder accepts: options, components and reference types
    defineField(
      PageBuilder(
        {
          name: 'heroComponents',
          title: 'Featured Exhibitions',
          group: 'exhibitions',
        },
        {
          components: [
            PageBuilderComponents.dzHero,
            PageBuilderComponents.dzHeroCarousel,
            PageBuilderComponents.dzGrid,
            PageBuilderComponents.dzSplit,
          ],
          references: {
            all: [exhibitionPage],
          },
        }
      )
    ),
    defineField({
      type: interstitial.name,
      title: 'Subscribe Interstitial',
      name: 'subscribeInterstitial',
      description: 'Interstitial module',
      group: 'exhibitions',
      options: {collapsed: true},
    }),
    defineField({
      name: 'museumHighlights',
      title: 'Museum Highlights',
      type: 'array',
      group: 'exhibitions',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: article.name}],
          options: {
            filter: '_type == "article" && category == "Museum Highlights"',
          },
        }),
      ],
    }),
    defineField({
      type: interstitial.name,
      title: 'Interstitial',
      name: 'interstitial',
      description: 'Interstitial module',
      group: 'exhibitions',
      options: {collapsed: true},
    }),
    defineField({
      type: interstitial.name,
      title: 'Past Exhibitions Interstitial',
      name: 'pastExhibitionsInterstitial',
      description: 'Interstitial module',
      group: 'pastExhibitions',
      options: {collapsed: true},
    }),
    defineField({
      name: 'pastExhibitionsSEO',
      title: 'Past Exhibitions SEO',
      type: 'seo',
      group: 'pastExhibitions',
      options: {collapsed: true},
    }),
  ],
  initialValue: {
    title: 'Exhibitions',
  },
})
