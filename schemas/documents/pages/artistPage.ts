import {defineField, defineType} from 'sanity'
import {UserIcon, DocumentsIcon} from '@sanity/icons'
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
import exhibition from '../exhibition'
import artwork from '../artwork'
import media from '../../objects/utils/media'
import fairPage from './fairPage'

export default defineType({
  name: 'artistPage',
  title: 'Artist Page',
  groups: [
    {name: 'content', title: 'Artist Page', icon: UserIcon, default: true},
    {name: 'subpages', title: 'Sub-Pages', icon: DocumentsIcon},
  ],
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      group: 'content',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      group: 'content',
      type: 'slugUrl',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'artist',
      title: 'Artist',
      group: 'content',
      type: 'reference',
      to: [{type: artist.name, title: 'Artist'}],
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
        {reference: exhibition}
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
        {reference: [exhibition, fairPage, article]}
      )
    ),

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
