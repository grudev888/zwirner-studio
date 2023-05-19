import {ComposeIcon, SearchIcon} from '@sanity/icons'
import {BlockElementIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import dzHero from '../objects/page/components/molecules/dzHero'
import dzCarousel from '../objects/page/components/molecules/dzCarousel'
import dzEditorial from '../objects/page/components/molecules/dzEditorial'
import dzConsignment from '../objects/page/components/molecules/dzConsignment'
import dzSplit from '../objects/page/components/molecules/dzSplit'
import dzInterstitial from '../objects/page/components/molecules/dzInterstitial'

export default defineType({
  name: 'collect',
  title: 'Collect',
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
      name: 'hero',
      type: dzHero.name,
      title: 'Hero',
      options: {collapsible: true, collapsed: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'onlineExhibitions',
      type: dzCarousel.name,
      title: 'Online Exhibitions',
      options: {collapsible: true, collapsed: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'upcomingFairs',
      type: dzCarousel.name,
      title: 'Upcoming Fairs',
      options: {collapsible: true, collapsed: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featuredArtworks',
      type: dzCarousel.name,
      title: 'Featured Artworks',
      options: {collapsible: true, collapsed: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: dzEditorial.name,
      name: 'editorial',
      title: 'Editorial',
      options: {collapsible: true, collapsed: true},
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
      type: dzSplit.name,
      title: 'Split',
      name: 'split',
      group: 'content',
      options: {collapsed: true, collapsible: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: dzInterstitial.name,
      title: 'Interstitial',
      name: 'interstitial',
      group: 'content',
      options: {collapsed: true, collapsible: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: dzInterstitial.name,
      title: 'Footer Interstitial',
      name: 'footerInterstitial',
      group: 'content',
      options: {collapsed: true, collapsible: true},
      validation: (rule) => rule.required(),
    }),
  ],
})
