import {ReferenceRule, StringRule, defineField, defineType} from 'sanity'
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
    {name: 'survey', title: 'Survey', icon: DocumentsIcon},
    {name: 'available_works', title: 'Available Works', icon: DocumentsIcon},
    {name: 'exhibitions', title: 'Exhibitions', icon: DocumentsIcon},
    {name: 'guide', title: 'Guide', icon: DocumentsIcon},
    {name: 'press', title: 'Press', icon: DocumentsIcon},
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
      validation: (rule: StringRule) => rule.required(),
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
      validation: (rule: ReferenceRule) => rule.required(),
    }),
    defineField({
      name: 'artistIntro',
      title: 'Artist Intro',
      group: 'content',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Item',
      type: 'reference',
      to: [exhibitionPage, fairPage, article, artwork].map(({name}) => ({
        type: name as string,
      })),
      group: 'content',
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
          group: 'survey',
        },
        {reference: [artwork, media]}
      )
    ),

    defineField({
      name: 'surveySeo',
      title: 'Survey Subpage Seo',
      group: 'survey',
      type: 'seo',
    }),

    defineField(
      gridModuleBuilder(
        {
          name: 'availableWorksSubpage',
          title: 'Available Works',
          group: 'available_works',
        },
        {reference: [artwork, media]}
      )
    ),

    defineField({
      name: 'availableWorksSeo',
      title: 'Available Works Subpage Seo',
      group: 'available_works',
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
      gridModuleBuilder(
        {
          name: 'guideSubpage',
          title: 'Guide',
          group: 'guide',
        },
        {reference: [exhibitionPage, fairPage, article]}
      )
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
      gridModuleBuilder(
        {
          name: 'pressSubpage',
          title: 'Press',
          group: 'press',
        },
        {reference: article}
      )
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
