import {ReferenceRule, StringRule, defineField, defineType} from 'sanity'
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
        },
        {
          hideComponentTitle: true,
          componentOptions: {title: 'Artworks'},
          components: [CarouselComponents.dzCard],
          references: {
            dzCard: [exhibitionPage, article, artwork],
          },
        },
      ),
    ),
    defineField(
      dzSplitBuilder(
        {
          name: 'availableWorksBooks',
          title: 'Available Works/Books Split',
          group: 'content',
          options: {collapsible: true, collapsed: false},
        },
        {references: [], hideComponentTitle: true, showAsPlainComponent: true},
      ),
    ),
    defineField(
      dzGridBuilder(
        {
          name: 'availableWorks',
          title: 'Available Works',
          group: 'content',
        },
        {
          gridProps: {
            title: 'Artworks',
          },
          hideComponentTitle: true,
          references: {
            dzCard: [artwork],
          },
          components: [GridComponents.dzCard],
        },
      ),
    ),
    defineField({
      name: 'availableWorksInterstitial',
      title: 'Available Works Interstitial',
      group: 'content',
      options: {collapsible: true, collapsed: false},
      type: interstitial.name,
    }),
    defineField(
      dzGridBuilder(
        {
          name: 'latestExhibitions',
          title: 'Latest Exhibitions',
          group: 'content',
        },
        {
          gridProps: {
            title: 'Exhibition',
          },
          hideComponentTitle: true,
          references: {
            dzCard: [exhibitionPage],
          },
          components: [GridComponents.dzCard],
        },
      ),
    ),
    defineField({
      name: 'exhibitionsInterstitial',
      title: 'Exhibitions Interstitial',
      group: 'content',
      type: interstitial.name,
      options: {collapsible: true, collapsed: false},
    }),
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
      dzGridBuilder(
        {
          name: 'surveySubpage',
          title: 'Survey',
          group: 'survey',
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
