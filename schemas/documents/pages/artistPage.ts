import {defineField, defineType} from 'sanity'
import {UserIcon, DocumentsIcon, SearchIcon} from '@sanity/icons'

import {builder as slugBuilder} from '../../objects/utils/slugUrl'
import {apiVersion} from '../../../env'
import {artistById} from '../../../queries/artist.queries'

import artist from '../artist'
import interstitial from '../../objects/page/components/primitives/interstitial'
import gridModule, {
  builder as gridModuleBuilder,
} from '../../objects/page/components/modules/gridModule'
import splitModule from '../../objects/page/components/modules/splitModule'
import carouselModule, {
  builder as carouselModuleBuilder,
} from '../../objects/page/components/modules/carouselModule'
import article from '../article'
import book from '../book'
import artwork from '../artwork'
import media from '../../objects/utils/media'
import fairPage from './fairPage'
import exhibitionPage from './exhibitionPage'

export default defineType({
  name: 'artistPage',
  title: 'Artist Page',
  groups: [
    {name: 'content', title: 'Artist Page', icon: UserIcon, default: true},
    {name: 'subpages', title: 'Sub-Pages', icon: DocumentsIcon},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
  ],
  type: 'document',
  fields: [
    defineField({
      type: 'seo',
      name: 'seo',
      title: 'SEO',
      group: 'seo',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      group: 'content',
      type: 'string',
      validation: (rule) => rule.required(),
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
        {prefix: '/artists'}
      )
    ),
    defineField({
      name: 'artist',
      title: 'Artist',
      group: 'content',
      type: 'reference',
      to: [{type: artist.name, title: 'Artist'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'artistIntro',
      title: 'Artist Intro',
      group: 'content',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'showHero',
      title: 'Show Hero',
      group: 'content',
      type: 'boolean',
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      group: 'content',
      type: splitModule.name,
      hidden: (context) => context.parent.showHero !== true,
    }),
    defineField({
      name: 'survey',
      title: 'Survey',
      group: 'content',
      type: carouselModule.name,
    }),
    defineField({
      name: 'availableWorksBooks',
      title: 'Available Works/Books Split',
      group: 'content',
      type: splitModule.name,
    }),
    defineField({
      name: 'availableWorks',
      title: 'Available Works',
      group: 'content',
      type: gridModule.name,
    }),
    defineField({
      name: 'availableWorksInterstitial',
      title: 'Available Works Interstitial',
      group: 'content',
      type: interstitial.name,
    }),
    defineField(
      gridModuleBuilder(
        {
          name: 'latestExhibitions',
          title: 'Latest Exhibitions',
          group: 'content',
        },
        {reference: exhibitionPage}
      )
    ),
    defineField({
      name: 'exhibitionsInterstitial',
      title: 'Exhibitions Interstitial',
      group: 'content',
      type: interstitial.name,
    }),
    defineField({
      name: 'moveGuideUp',
      title: 'Move Guide Up',
      group: 'content',
      type: 'boolean',
    }),
    defineField(
      carouselModuleBuilder(
        {
          name: 'guide',
          title: 'Guide',
          group: 'content',
        },
        {reference: article}
      )
    ),
    defineField(
      gridModuleBuilder(
        {
          name: 'selectedPress',
          title: 'Selected Press',
          group: 'content',
        },
        {reference: article}
      )
    ),
    defineField(
      carouselModuleBuilder(
        {
          name: 'books',
          title: 'Books',
          group: 'content',
        },
        {reference: book}
      )
    ),
    defineField({
      name: 'interstitial',
      title: 'Interstitial',
      group: 'content',
      type: 'interstitial',
    }),

    // Subpages

    defineField(
      gridModuleBuilder(
        {
          name: 'surveySubpage',
          title: 'Survey',
          group: 'subpages',
        },
        {reference: [artwork, media]}
      )
    ),

    defineField(
      gridModuleBuilder(
        {
          name: 'availableWorksSubpage',
          title: 'Available Works',
          group: 'subpages',
        },
        {reference: [artwork, media]}
      )
    ),

    defineField({
      name: 'exhibitionsInterstitialSubpage',
      title: 'Exhibitions Interstitial',
      group: 'subpages',
      type: interstitial.name,
    }),

    defineField(
      gridModuleBuilder(
        {
          name: 'guideSubpage',
          title: 'Guide',
          group: 'subpages',
        },
        {reference: [exhibitionPage, fairPage, article]}
      )
    ),

    defineField({
      name: 'guideInterstitialSubpage',
      title: 'Guide Interstitial',
      group: 'subpages',
      type: interstitial.name,
    }),

    defineField(
      gridModuleBuilder(
        {
          name: 'pressSubpage',
          title: 'Press',
          group: 'subpages',
        },
        {reference: article}
      )
    ),

    defineField({
      name: 'pressInterstitialSubpage',
      title: 'Press Interstitial',
      group: 'subpages',
      type: interstitial.name,
    }),
  ],
})
