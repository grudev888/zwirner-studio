import {ComposeIcon, MasterDetailIcon, SearchIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import page from '../documents/page'
import articlePage from '../documents/pages/articlePage'
import artistPage from '../documents/pages/artistPage'
import exhibitionPage from '../documents/pages/exhibitionPage'
import fairPage from '../documents/pages/fairPage'

const allowedDocs = [page, exhibitionPage, fairPage, artistPage, articlePage]

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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'header',
      title: 'Header Carousel',
      type: 'array',
      of: allowedDocs.map(({name}) => ({type: 'reference', name, to: {type: name}})),
      group: 'content',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Item',
      type: 'reference',
      to: allowedDocs.map(({name}) => ({type: name as string})),
      group: 'content',
    }),
    defineField({
      name: 'firstCarousel',
      title: 'Body Carousel 1',
      type: 'array',
      of: allowedDocs.map(({name, title}) => ({
        type: 'reference',
        name,
        title,
        to: {type: name},
      })),
      group: 'content',
    }),
    defineField({
      name: 'secondCarousel',
      title: 'Body Carousel 2',
      type: 'array',
      of: allowedDocs.map(({name, title}) => ({type: 'reference', name, title, to: {type: name}})),
      group: 'content',
    }),
    defineField({
      name: 'articles',
      title: 'Article Grid',
      type: 'array',
      of: [{type: 'reference', name: 'article', to: {type: 'articlePage'}}],
      group: 'content',
    }),
    defineField({name: 'interstitial', title: 'Interstitial', type: 'dzInterstitial'}),
    defineField({
      name: 'locations',
      title: 'Locations',
      group: 'content',
      type: 'array',
      of: [{type: 'location'}],
    }),
  ],
})
