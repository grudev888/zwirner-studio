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
].map((type) => ({type}))

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
      type: 'dzHeroCarousel',
      group: 'content',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Item',
      type: 'reference',
      to: allowedDocs,
      group: 'content',
    }),
    defineField({
      name: 'firstCarousel',
      title: 'Body Carousel 1',
      type: 'array',
      of: allowedDocs,
      group: 'content',
    }),
    defineField({
      name: 'secondCarousel',
      title: 'Body Carousel 2',
      type: 'array',
      of: allowedDocs,
      group: 'content',
    }),
    defineField({
      name: 'articles',
      title: 'Article Grid',
      type: 'array',
      of: allowedDocs,
      group: 'content',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      group: 'content',
      type: 'reference',
      to: [{type: 'location'}],
    }),
  ],
})
