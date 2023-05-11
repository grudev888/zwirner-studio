import {defineField, defineType} from 'sanity'
import {DocumentTextIcon, ComposeIcon, SearchIcon} from '@sanity/icons'

import authorType from './author'

export interface ArticleSchema {
  title?: string
  images?: any
  author?: any
  publisherName?: string
  description?: string
  publisherLogo?: string
}

export default defineType({
  type: 'document',
  name: 'article',
  title: 'Article',
  icon: DocumentTextIcon,
  groups: [
    {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
  ],
  fields: [
    defineField({
      type: 'string',
      name: 'title',
      title: 'Title',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{type: 'image'}],
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: authorType.name}],
    }),
    defineField({
      type: 'string',
      name: 'publisherName',
      title: 'Publisher Name',
    }),
    defineField({
      name: 'description',
      title: 'Description, bio',
      type: 'text',
    }),
    defineField({
      name: 'publisherLogo',
      title: 'Publisher Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        },
      ],
    }),
  ],
})
