import {ComposeIcon, LinkIcon, MasterDetailIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export interface DzInterstitialTypeProps {
  title: string
  split: boolean
  image?: any
  enables: boolean
}

export default defineType({
  name: 'dzInterstitial',
  title: 'Interstitial',
  type: 'object',
  icon: MasterDetailIcon,
  groups: [
    {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
    {name: 'references', title: 'References', icon: LinkIcon},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Component title',
      group: ['references', 'content'],
    }),
    defineField({
      name: 'split',
      title: 'Split',
      type: 'boolean',
      group: 'references',
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'references',
      title: 'Content',
      type: 'pageContent',
      group: 'references',
    }),
    defineField({
      name: 'cta',
      type: 'string',
      title: 'CTA title',
      group: 'content',
    }),
    defineField({
      name: 'subtitle',
      type: 'string',
      title: 'Component subtitle',
      group: 'content',
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      group: 'content',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        },
        {
          name: 'url',
          type: 'string',
          title: 'Url redirect',
        },
      ],
    }),
  ],
})
