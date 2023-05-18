import {ComposeIcon, SearchIcon, MasterDetailIcon} from '@sanity/icons'
import {BlockElementIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import artwork from '../documents/artwork'
import dzCardMedia from '../objects/page/components/molecules/dzCard/dzCardMedia'
import seo from '../objects/page/seo'
import dzHero from '../objects/page/components/molecules/dzHero'
import dzEditorial from '../objects/page/components/molecules/dzEditorial'
import dzInterstitial from '../objects/page/components/molecules/dzInterstitial'

export default defineType({
  name: 'utopiaEditions',
  title: 'Utopia Editions',
  type: 'document',
  icon: BlockElementIcon,
  preview: {select: {title: 'title'}},
  groups: [
    {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
  ],
  fields: [
    defineField({
      name: 'seo',
      title: 'SEO',
      type: seo.name,
      group: 'seo',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'hero',
      type: dzHero.name,
      title: 'Hero',
      options: {collapsible: true, collapsed: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'editorial',
      type: 'object',
      title: 'Editorial',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({
          name: 'content',
          type: dzEditorial.name,
          title: 'Content',
          validation: (rule) => rule.required(),
        }),
        defineField({
          type: 'dzButton',
          name: 'Button',
          title: 'Button',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'nowAvailable',
      type: 'object',
      title: 'Now available',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          initialValue: 'Now Available from Utopia Editions',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'hero',
          type: dzHero.name,
          title: 'Hero',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'comingSoon',
      type: 'object',
      title: 'Coming soon',
      options: {collapsible: true, collapsed: true},
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          initialValue: 'Coming Soon From Utopia Editions',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'hero',
          type: dzHero.name,
          title: 'Hero',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'prints',
      type: 'object',
      title: 'Prints grid',
      options: {collapsible: true, collapsed: true},
      validation: (rule) => rule.required(),
      groups: [
        {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
        {name: 'attributes', title: 'Attributes', icon: MasterDetailIcon},
      ],
      fields: [
        defineField({
          name: 'Title',
          title: 'Title',
          type: 'string',
          initialValue: 'Browse Prints from Utopia Editions',
          group: 'content',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'columns',
          title: 'Columns',
          type: 'number',
          initialValue: 4,
          group: 'attributes',
          validation: (rule) => rule.required().min(1),
        }),
        defineField({
          name: 'artworks',
          title: 'Prints',
          type: 'array',
          group: 'content',
          of: [defineArrayMember({type: 'reference', title: 'Artwork', to: {type: artwork.name}})],
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'interstitial',
      title: 'Interstitial',
      type: dzInterstitial.name,
      group: 'content',
      options: {collapsible: true, collapsed: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cards',
      title: 'Media Cards',
      type: 'array',
      options: {layout: 'grid'},
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: dzCardMedia.name,
          validation: (rule) => rule.required(),
        }),
      ],
    }),
  ],
})
