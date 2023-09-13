import {ComposeIcon, SearchIcon, DocumentIcon} from '@sanity/icons'
import {BlockElementIcon} from '@sanity/icons'
import {StringRule, defineArrayMember, defineField, defineType, SchemaTypeDefinition} from 'sanity'
import article from '../documents/article'
import interstitial from '../objects/page/components/primitives/interstitial'
import {builder as PageBuilder, PageBuilderComponents} from '../objects/utils/pageBuilder'
import { hiddenSlug } from '../objects/data/hiddenSlug'
import {GridComponents} from '../objects/page/grid'
import artwork from '../documents/artwork'
import location from '../documents/location'
import book from '../documents/book'
import artist from '../documents/artist'
import podcast from '../documents/podcast'

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
  fieldsets: [
    {
      name: 'featuredExhibitions',
      title: 'Featured Exhibitions',
      options: {
        collapsible: true,
        collapsed: false,
      },
    },
    {
      name: 'museumHighlights',
      title: 'Museum Highlights',
      options: {
        collapsible: true,
        collapsed: false,
      },
    },
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
      group: 'exhibitions',
      validation: (rule: StringRule) => rule.required(),
    }),

    // FEATURED EXHIBITIONS, PAGE BUILDER SECTION
    defineField(
      PageBuilder(
        {
          name: 'introContent',
          title: ' ',
          group: 'exhibitions',
          fieldset: 'featuredExhibitions',
        },
        {
          components: [
            PageBuilderComponents.dzHero,
            PageBuilderComponents.dzSplit,
            PageBuilderComponents.dzGrid,
          ],
          references: {
            dzHero: [{name: 'exhibitionPage', title: 'Exhibition'} as SchemaTypeDefinition],
            dzSplit: [{name: 'exhibitionPage', title: 'Exhibition'} as SchemaTypeDefinition],
            grid: {
              references: {
                dzCard: [
                  artwork,
                  book,
                  location,
                  artist,
                  podcast,
                  {name: 'article', title: 'Article'} as SchemaTypeDefinition,
                  {name: 'exhibitionPage', title: 'Exhibition'} as SchemaTypeDefinition,
                ],
              },
              components: [GridComponents.dzCard, GridComponents.dzMedia],
            },
          },
        },
      ),
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
      title: ' ',
      type: 'array',
      group: 'exhibitions',
      fieldset: 'museumHighlights',
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
