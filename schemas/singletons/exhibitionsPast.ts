import {ComposeIcon, SearchIcon} from '@sanity/icons'
import {BlockElementIcon} from '@sanity/icons'
import {StringRule, defineField, defineType} from 'sanity'
import interstitial from '../objects/page/components/primitives/interstitial'
import { hiddenSlug } from '../objects/data/hiddenSlug'

export default defineType({
  name: 'exhibitionsPast',
  title: 'Exhibitions Past',
  type: 'document',
  icon: BlockElementIcon,
  preview: {select: {title: 'title'}},
  groups: [
    {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
  ],
  fields: [
    hiddenSlug,
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule: StringRule) => rule.required(),
    }),
    defineField({
      type: interstitial.name,
      title: 'Past Exhibitions Interstitial',
      name: 'pastExhibitionsInterstitial',
      description: 'Interstitial module',
      group: 'content',
      options: {collapsed: true},
    }),
    defineField({
        name: 'seo',
        title: 'SEO',
        type: 'seo',
        group: 'seo',
      }),
  ],
  initialValue: {
    title: 'Past Exhibitions',
  },
})
