import {ComposeIcon, SearchIcon} from '@sanity/icons'
import {BlockElementIcon} from '@sanity/icons'
import {StringRule, defineField, defineType} from 'sanity'
import interstitial from '../objects/page/components/primitives/interstitial'
import { hiddenSlug } from '../objects/data/hiddenSlug'

export default defineType({
  name: 'artistListing',
  title: 'Artist Listing',
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
      hidden: true,
      validation: (rule: StringRule) => rule.required(),
    }),
    defineField({
      type: interstitial.name,
      title: 'Interstitial',
      name: 'interstitial',
      description: 'Interstitial module',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
  ],
  initialValue: {
    title: 'Artists',
  }
})
