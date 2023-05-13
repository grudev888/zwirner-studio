import {ComposeIcon, MasterDetailIcon, SearchIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import page from '../documents/page'
import articlePage from '../documents/pages/articlePage'
import artistPage from '../documents/pages/artistPage'
import exhibitionPage from '../documents/pages/exhibitionPage'
import fairPage from '../documents/pages/fairPage'

const allowedDocs = [
  page.name,
  exhibitionPage.name,
  fairPage.name,
  artistPage.name,
  articlePage.name,
]

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
      of: allowedDocs.map((type) => ({type: 'reference', name: type, to: {type}})),
      group: 'content',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Item',
      type: 'reference',
      to: allowedDocs.map((type) => ({type})),
      group: 'content',
    }),
    defineField({
      name: 'firstCarousel',
      title: 'Body Carousel 1',
      type: 'array',
      of: allowedDocs.map((type) => ({type: 'reference', name: type, to: {type}})),
      group: 'content',
    }),
    defineField({
      name: 'secondCarousel',
      title: 'Body Carousel 2',
      type: 'array',
      of: allowedDocs.map((type) => ({type: 'reference', name: type, to: {type}})),
      group: 'content',
    }),
    defineField({
      name: 'articles',
      title: 'Article Grid',
      type: 'array',
      of: [{type: 'reference', name: 'article', to: {type: 'articlePage'}}],
      group: 'content',
    }),
    defineField({name: 'interstitial', title: 'Intestitial', type: 'dzInterstitial'}),
    defineField({
      name: 'locations',
      title: 'Locations',
      group: 'content',
      type: 'array',
      of: [{type: 'reference', name: 'location', to: {type: 'location'}}],
    }),
  ],
})
