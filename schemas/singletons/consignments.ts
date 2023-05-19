import {ComposeIcon, MasterDetailIcon, SearchIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import artwork from '../documents/artwork'
import dzCardMedia from '../objects/page/components/molecules/dzCard/dzCardMedia'
import dzEditorial from '../objects/page/components/molecules/dzEditorial'
import dzConsignment from '../objects/page/components/molecules/dzConsignment'
import dzInterstitial from '../objects/page/components/molecules/dzInterstitial'

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
      name: 'mediaCard',
      title: 'Media Card',
      type: dzCardMedia.name,
      group: 'content',
      options: {collapsed: true, collapsible: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'editorial',
      title: 'Editorial',
      type: dzEditorial.name,
      group: 'content',
      options: {collapsed: true, collapsible: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'consignment',
      title: 'Consignments',
      type: dzConsignment.name,
      group: 'content',
      options: {collapsed: true, collapsible: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'secondMediaCard',
      title: 'Media Card',
      type: dzCardMedia.name,
      group: 'content',
      options: {collapsed: true, collapsible: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'interstitial',
      title: 'Interstitial',
      type: dzInterstitial.name,
      group: 'content',
      options: {collapsed: true, collapsible: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'middleMediaCards',
      title: 'Middle Media Cards',
      type: 'array',
      group: 'content',
      validation: (rule) => rule.required().length(5),
      of: [
        defineArrayMember({
          name: 'media',
          title: 'Media',
          type: 'object',
          preview: {
            select: {
              title: `editorial.title`,
              cardMedia: 'cardMedia',
              media: 'cardMedia.imageOverride',
            },
          },
          fields: [
            defineField({type: dzCardMedia.name, name: 'cardMedia'}),
            defineField({type: dzEditorial.name, name: 'editorial'}),
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
      type: dzInterstitial.name,
      group: 'content',
      options: {collapsed: true, collapsible: true},
      validation: (rule) => rule.required(),
    }),
  ],
})
