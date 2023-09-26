import {ComposeIcon, SearchIcon, DocumentIcon} from '@sanity/icons'
import {BlockElementIcon} from '@sanity/icons'
import {StringRule, defineField, defineType, SchemaTypeDefinition} from 'sanity'
import {ArticleCategory} from '../documents/article'
import * as Interstitial from '../objects/page/components/primitives/interstitial'
import * as DzGrid from '../objects/page/grid'
import {builder as PageBuilder, PageBuilderComponents} from '../objects/utils/pageBuilder'
import {hiddenSlug} from '../objects/data/hiddenSlug'
import {GridComponents} from '../objects/page/grid'
import artwork from '../documents/artwork'
import location from '../documents/location'
import book from '../documents/book'
import artist from '../documents/artist'
import podcast from '../documents/podcast'

export enum UpcomingMolecules {
  'DZ Hero Carousel' = 'heroCarousel',
  '2-Up Grid' = '2-up',
  '3-Up Grid' = '3-up',
}

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
      type: 'string',
      name: 'upcomingComponent',
      title: 'Upcoming Component',
      group: 'exhibitions',
      options: {
        list: Object.entries(UpcomingMolecules).map(([title, value]) => ({title, value})),
      },
      initialValue: UpcomingMolecules['DZ Hero Carousel'],
    }),

    defineField(
      Interstitial.builder({
        title: 'Subscribe Interstitial',
        name: 'subscribeInterstitial',
        description: 'Interstitial module',
        group: 'exhibitions',
        options: {collapsed: true},
      }),
    ),

    defineField(
      DzGrid.builder(
        {
          name: 'museumHighlights',
          title: ' ',
          group: 'exhibitions',
          fieldset: 'museumHighlights',
        },
        {
          hideComponentTitle: true,
          references: {
            dzCard: [
              {
                name: 'article',
                title: 'Article',
              } as any,
            ],
          },
          referencesFilter: {
            dzCard: {
              article: `_type == "article" && category == "${ArticleCategory['Museum Highlights']}"`,
            },
          },
          components: [GridComponents.dzCard],
        },
      ),
    ),
    defineField(
      Interstitial.builder({
        title: 'Interstitial',
        name: 'interstitial',
        description: 'Interstitial module',
        group: 'exhibitions',
        options: {collapsed: true},
      }),
    ),

    defineField(
      Interstitial.builder({
        title: 'Past Exhibitions Interstitial',
        name: 'pastExhibitionsInterstitial',
        description: 'Interstitial module',
        group: 'pastExhibitions',
        options: {collapsed: true},
      }),
    ),

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
