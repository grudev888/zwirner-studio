import {ComposeIcon, MasterDetailIcon, SearchIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import artistPage from '../documents/pages/artistPage'
import exhibitionPage from '../documents/pages/exhibitionPage'
import article from '../documents/article'
import fairPage from '../documents/pages/fairPage'

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
      name: 'editorial',
      title: 'Editorial',
      type: 'dzEditorial',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'consignment',
      title: 'Consignments',
      type: 'dzConsignment',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'secondHero',
      title: 'Hero',
      type: 'dzHero',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'interstitial',
      title: 'Interstitial',
      type: 'dzInterstitial',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'middleHeros',
      title: 'Middle Heros',
      type: 'array',
      group: 'content',
      validation: (rule) => rule.required().length(5),
      of: [defineArrayMember({type: 'dzEditorial', title: 'Editorial'})],
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
          to: [
            {type: artistPage.name},
            {type: exhibitionPage.name},
            {type: article.name},
            {type: fairPage.name},
          ],
        }),
      ],
    }),
    defineField({
      name: 'footerInterstitial',
      title: 'Interstitial',
      type: 'dzInterstitial',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
  ],
})
