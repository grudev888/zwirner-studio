import {BlockElementIcon, SearchIcon, ComposeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'availableArtworks',
  title: 'Available Works',
  type: 'document',
  icon: BlockElementIcon,
  groups: [
    {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'displayNumberOfResults',
      type: 'boolean',
      title: 'Display # of results',
      initialValue: false,
    }),
    defineField({
      name: 'artworks',
      title: 'Artworks Grid',
      type: 'array',
      of: [{type: 'reference', name: 'artwork', to: {type: 'artwork'}}],
      group: 'content',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
})
