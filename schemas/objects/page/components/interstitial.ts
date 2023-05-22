import {MasterDetailIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'interstitial',
  title: 'Interstitial',
  type: 'object',
  icon: MasterDetailIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'subtitle',
      type: 'string',
      title: 'Subtitle',
    }),
    defineField({
      name: 'split',
      title: 'Split',
      type: 'boolean',
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cta',
      type: 'string',
      title: 'CTA',
    }),
    defineField({
      name: 'ctaAction',
      type: 'string',
      title: 'CTA action',
      options: {list: ['Newsletter', 'Link']},
    }),
    defineField({
      name: 'ctaLink',
      type: 'object',
      title: 'CTA link',
      fields: [
        defineField({
          name: 'href',
          type: 'url',
          title: 'URL',
        }),
        defineField({
          title: 'Open in new tab',
          name: 'blank',
          type: 'boolean',
        }),
      ],
      hidden: ({parent}) => parent?.ctaAction !== 'Link',
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: {hotspot: true},
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
