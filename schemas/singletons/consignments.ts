import {ComposeIcon, MasterDetailIcon, SearchIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import artwork from '../documents/artwork'

export default defineType({
  name: 'consignments',
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
      name: 'hero',
      title: 'Hero',
      type: 'dzHero',
      group: 'content',
      options: {collapsed: true, collapsible: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'editorial',
      title: 'Editorial',
      type: 'dzEditorial',
      group: 'content',
      options: {collapsed: true, collapsible: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'consignment',
      title: 'Consignments',
      type: 'dzConsignment',
      group: 'content',
      options: {collapsed: true, collapsible: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'secondHero',
      title: 'Hero',
      type: 'dzHero',
      group: 'content',
      options: {collapsed: true, collapsible: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'interstitial',
      title: 'Interstitial',
      type: 'dzInterstitial',
      group: 'content',
      options: {collapsed: true, collapsible: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'middleHeros',
      title: 'Middle Heros',
      type: 'array',
      group: 'content',
      validation: (rule) => rule.required().length(5),
      of: [
        defineArrayMember({
          type: 'object',
          title: 'Element',
          name: 'element',
          preview: {select: {title: 'editorial.title'}},
          fields: [
            defineField({type: 'dzHero', name: 'hero', title: 'Hero'}),
            defineField({type: 'dzEditorial', name: 'editorial', title: 'Editorial'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'works',
      title: 'Exceptional works',
      type: 'array',
      group: 'content',
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: artwork.name}],
          title: 'Artworks',
        }),
      ],
    }),
    defineField({
      name: 'footerInterstitial',
      title: 'Interstitial',
      type: 'dzInterstitial',
      group: 'content',
      options: {collapsed: true, collapsible: true},
      validation: (rule) => rule.required(),
    }),
  ],
})
