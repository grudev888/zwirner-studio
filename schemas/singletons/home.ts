import {ComposeIcon, MasterDetailIcon, SearchIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import page from '../documents/page'
import artistPage from '../documents/pages/artistPage'
import exhibitionPage from '../documents/pages/exhibitionPage'
import fairPage from '../documents/pages/fairPage'
import article from '../documents/article'
import location from '../documents/location'
import dzInterstitial from '../objects/page/components/molecules/dzInterstitial'
import {builder as carouselBuilder} from '../objects/page/components/modules/carouselModule'
import artwork from '../documents/artwork'

const allowedDocs = [page, exhibitionPage, fairPage, artistPage, article, artwork]

export default defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  icon: MasterDetailIcon,
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'header',
      title: 'Header Carousel',
      type: 'array',
      of: allowedDocs.map(({name, title}) => ({type: 'reference', name, title, to: {type: name}})),
      group: 'content',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Item',
      type: 'reference',
      to: allowedDocs.map(({name}) => ({type: name as string})),
      group: 'content',
    }),
    defineField(
      carouselBuilder(
        {
          name: 'firstCarousel',
          title: 'Body Carousel 1',
          group: 'content',
        },
        {reference: exhibitionPage, excludedFields: ['title']}
      )
    ),
    defineField(
      carouselBuilder(
        {
          name: 'secondCarousel',
          title: 'Body Carousel 2',
          group: 'content',
        },
        {reference: exhibitionPage, excludedFields: ['title']}
      )
    ),
    defineField({
      name: 'articles',
      title: 'Article Grid',
      type: 'array',
      of: [{type: 'reference', name: article.name, title: article.title, to: {type: article.name}}],
      group: 'content',
    }),
    defineField({
      name: 'interstitial',
      title: 'Interstitial',
      group: 'content',
      type: dzInterstitial.name,
    }),
    defineField({
      name: 'locations',
      title: 'Locations',
      group: 'content',
      type: 'array',
      of: [
        {type: 'reference', name: location.name, title: location.title, to: {type: location.name}},
      ],
    }),
  ],
})
