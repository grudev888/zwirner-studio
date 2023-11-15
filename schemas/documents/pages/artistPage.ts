import {
  ReferenceRule,
  StringRule,
  defineField,
  defineType,
  defineArrayMember,
  SchemaTypeDefinition,
} from 'sanity'
import {UserIcon, DocumentsIcon, SearchIcon} from '@sanity/icons'

import {builder as slugBuilder} from '../../objects/utils/slugUrl'
import {apiVersion} from '../../../env'
import {artistById} from '../../../queries/artist.queries'

import artist from '../artist'
import interstitial from '../../objects/page/components/primitives/interstitial'

import article from '../article'
import book from '../book'
import artwork from '../artwork'
import exhibitionPage from './exhibitionPage'

import {
  builder as dzCarouselBuilder,
  CarouselComponents,
} from '../../objects/page/components/molecules/dzCarousel'
import {builder as dzGridBuilder, GridComponents} from '../../objects/page/grid'
import {builder as dzSplitBuilder} from '../../objects/page/components/molecules/dzSplit'
import {builder as PageBuilder, PageBuilderComponents} from '../../objects/utils/pageBuilder'

export default defineType({
  name: 'artistPage',
  title: 'Artist Page',
  icon: UserIcon,
  groups: [
    {name: 'content', title: 'Artist Page', icon: UserIcon, default: true},
    {name: 'survey', title: 'Survey', icon: DocumentsIcon},
    {name: 'availableWorks', title: 'Available Works', icon: DocumentsIcon},
    {name: 'exhibitions', title: 'Exhibitions', icon: DocumentsIcon},
    {name: 'guide', title: 'Guide', icon: DocumentsIcon},
    {name: 'press', title: 'Press', icon: DocumentsIcon},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
  ],
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      group: 'content',
      type: 'string',
      validation: (rule: StringRule) => rule.required(),
    }),
    defineField({
      name: 'artist',
      title: 'Artist',
      group: 'content',
      type: 'reference',
      to: [{type: artist.name, title: 'Artist'}],
      validation: (rule: ReferenceRule) => rule.required(),
    }),
    defineField({
      name: 'artistIntro',
      title: 'Artist Intro',
      group: 'content',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField(
      dzSplitBuilder(
        {
          name: 'featured',
          title: 'Featured Item',
          group: 'content',
          options: {collapsible: true, collapsed: false},
        },
        {references: [exhibitionPage, article], hideComponentTitle: true},
      ),
    ),
    defineField(
      dzCarouselBuilder(
        {
          name: 'survey',
          title: 'Survey',
          group: 'content',
          options: {collapsible: true, collapsed: false},
          // This is a temp solution for thomas Ruff, must be removed on series unification
          hidden: ({parent}: any) => parent?.slug?.current?.endsWith('thomas-ruff'),
        },
        {
          hideComponentTitle: true,
          componentOptions: {title: 'Artworks'},
          carouselSizes: [{value: 'XL', title: 'XL'}, 'L'],
          components: [CarouselComponents.dzCard],
          references: {
            dzCard: [artwork],
          },
        },
      ),
    ),
    // This is a temp solution for thomas Ruff, must be removed on series unification
    defineField(
      dzCarouselBuilder(
        {
          name: 'surveyThomas',
          title: 'Survey',
          group: 'content',
          options: {collapsible: true, collapsed: false},
          hidden: ({parent}: any) => !parent?.slug?.current?.endsWith('thomas-ruff'),
        },
        {
          hideComponentTitle: true,
          componentOptions: {title: 'Artworks'},
          carouselSizes: [{value: 'XL', title: 'XL'}, 'L'],
          components: [CarouselComponents.dzCard],
          references: {
            dzCard: [artwork, {name: 'series', title: 'Series'} as SchemaTypeDefinition],
          },
        },
      ),
    ),
    defineField(
      PageBuilder(
        {
          name: 'availableWorks',
          title: 'Available Works',
          group: 'content',
          options: {collapsible: true, collapsed: false},
        },
        {
          components: [
            PageBuilderComponents.dzInterstitial,
            PageBuilderComponents.dzSplit,
            PageBuilderComponents.dzCarousel,
          ],
          references: {
            dzSplit: [artwork, book],
            dzCarousel: {
              references: {
                dzCard: [artwork, book],
              },
              components: [GridComponents.dzCard, GridComponents.dzMedia],
            },
          },
          componentOptions: {
            dzSplit: {hideComponentTitle: true, showAsPlainComponent: true},
            dzCarousel: {
              carouselSizes: ['S'],
            },
          },
        },
      ),
    ),
    defineField(
      PageBuilder(
        {
          name: 'latestExhibitions',
          title: 'Latest Exhibitions',
          group: 'content',
          options: {collapsible: true, collapsed: false},
        },
        {
          components: [
            PageBuilderComponents.dzGrid,
            PageBuilderComponents.dzHero,
            PageBuilderComponents.dzInterstitial,
            PageBuilderComponents.dzSplit,
          ],
          references: {
            dzSplit: [exhibitionPage],
            dzHero: [exhibitionPage],
            grid: {
              references: {
                dzCard: [exhibitionPage],
              },
              components: [GridComponents.dzCard],
            },
          },
          componentOptions: {
            grid: {hideComponentTitle: true},
            dzInterstitial: {
              // FE manage logic here, no need to display any option for content editors
              hideCtaOptions: true,
            },
          },
        },
      ),
    ),
    defineField({
      name: 'moveGuideUp',
      title: 'Move Guide Up',
      group: 'content',
      type: 'boolean',
    }),
    defineField(
      dzCarouselBuilder(
        {
          name: 'guide',
          title: 'Guide',
          group: 'content',
          options: {collapsible: true, collapsed: false},
        },
        {
          hideSize: true,
          hideComponentTitle: true,
          componentOptions: {title: 'Article'},
          components: [CarouselComponents.dzCard],
          references: {
            dzCard: [article],
          },
        },
      ),
    ),

    defineField(
      dzGridBuilder(
        {
          name: 'selectedPress',
          title: 'Selected Press',
          group: 'content',
        },
        {
          gridProps: {
            title: 'Articles',
          },
          hideItemsPerRow: true,
          hideComponentTitle: true,
          references: {
            dzCard: [article],
          },
          components: [GridComponents.dzCard],
        },
      ),
    ),

    defineField(
      dzCarouselBuilder(
        {
          name: 'books',
          title: 'Books',
          group: 'content',
          options: {collapsible: true, collapsed: false},
        },
        {
          hideComponentTitle: true,
          componentOptions: {title: 'Books'},
          components: [CarouselComponents.dzCard],
          references: {
            dzCard: [book],
          },
        },
      ),
    ),
    defineField({
      name: 'interstitial',
      title: 'Interstitial',
      group: 'content',
      type: 'interstitial',
      options: {collapsible: true, collapsed: false},
    }),
    defineField(
      slugBuilder(
        {
          name: 'slug',
          title: 'Slug',
          options: {
            source: async (object: any, context: any) => {
              const artistRef = object?.artist?._ref
              const defaultSlug = object?.title ?? ''

              if (!defaultSlug && !artistRef)
                throw new Error('Please add a title or an artist to create a unique slug.')

              if (!artistRef) return defaultSlug

              const {getClient} = context
              const client = getClient({apiVersion})
              const params = {artistId: artistRef}

              const result = await client.fetch(artistById, params)
              return result?.[0]?.fullName ?? defaultSlug
            },
          },
          group: 'content',
        },
        {prefix: '/artists'},
      ),
    ),

    // Subpages

    defineField(
      PageBuilder(
        {
          name: 'surveySubpage',
          title: 'Survey',
          group: 'survey',
          options: {collapsible: true, collapsed: false},
        },
        {
          components: [
            PageBuilderComponents.dzInterstitial,
            PageBuilderComponents.dzGrid,
            PageBuilderComponents.dzCarousel,
          ],
          references: {
            dzCarousel: {
              references: {
                dzCard: [artwork],
              },
              components: [CarouselComponents.dzCard, CarouselComponents.dzMedia],
            },
            grid: {
              references: {
                dzCard: [artwork],
              },
              components: [GridComponents.dzCard, GridComponents.dzMedia],
            },
          },
          componentOptions: {
            dzCarousel: {
              carouselSizes: [{value: 'XL', title: 'XL'}],
            },
            grid: {
              hideComponentTitle: true,
            },
          },
        },
      ),
    ),

    defineField({
      name: 'surveySeries',
      title: 'Series',
      type: 'array',
      group: 'survey',
      hidden: ({parent}) => !parent?.slug?.current?.endsWith('thomas-ruff'),
      of: [
        defineArrayMember({
          title: 'Series',
          type: 'reference',
          to: [{type: 'series'}],
        }),
      ],
    }),

    defineField({
      name: 'surveySeo',
      title: 'Survey Subpage Seo',
      group: 'survey',
      type: 'seo',
    }),

    defineField(
      dzGridBuilder(
        {
          name: 'availableWorksSubpage',
          title: 'Available Works',
          group: 'availableWorks',
        },
        {
          gridProps: {
            title: 'Content',
          },
          hideComponentTitle: true,
          references: {
            dzCard: [artwork],
          },
          components: [GridComponents.dzCard, GridComponents.dzMedia],
        },
      ),
    ),

    defineField({
      name: 'availableWorksSeo',
      title: 'Available Works Subpage Seo',
      group: 'availableWorks',
      type: 'seo',
    }),

    defineField({
      name: 'exhibitionsInterstitialSubpage',
      title: 'Exhibitions',
      group: 'exhibitions',
      type: interstitial.name,
    }),

    defineField({
      name: 'exhibitionsInterstitialSeo',
      title: 'Exhibitions Subpage Seo',
      group: 'exhibitions',
      type: 'seo',
    }),

    defineField(
      dzGridBuilder(
        {
          name: 'guideSubpage',
          title: 'Guide',
          group: 'guide',
        },
        {
          gridProps: {
            title: 'Content',
          },
          hideComponentTitle: true,
          references: {
            dzCard: [article, exhibitionPage],
          },
          components: [GridComponents.dzCard],
        },
      ),
    ),

    defineField({
      name: 'guideInterstitialSubpage',
      title: 'Guide Interstitial',
      group: 'guide',
      type: interstitial.name,
    }),

    defineField({
      name: 'guideSeo',
      title: 'Guide Seo',
      group: 'guide',
      type: 'seo',
    }),

    defineField(
      dzGridBuilder(
        {
          name: 'pressSubpage',
          title: 'Press',
          group: 'press',
        },
        {
          gridProps: {
            title: 'Content',
          },
          hideComponentTitle: true,
          references: {
            dzCard: [article],
          },
          components: [GridComponents.dzCard],
        },
      ),
    ),

    defineField({
      name: 'pressInterstitialSubpage',
      title: 'Press Interstitial',
      group: 'press',
      type: interstitial.name,
    }),

    defineField({
      name: 'pressSeo',
      title: 'Press Subpage Seo',
      group: 'press',
      type: 'seo',
    }),
    defineField({
      type: 'seo',
      name: 'seo',
      title: 'SEO',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      images: 'artist.biographyPicture',
    },
    prepare({title, images}) {
      return {title, media: images ?? UserIcon}
    },
  },
})
