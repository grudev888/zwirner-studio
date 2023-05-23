import {ComposeIcon, MasterDetailIcon, SearchIcon} from '@sanity/icons'
import {ObjectRule, defineArrayMember, defineField, defineType} from 'sanity'
import dzConsignment from '../objects/page/components/molecules/dzConsignment'
import media from '../objects/utils/media'
import artist from '../documents/artist'
import * as Interstitial from '../objects/page/components/interstitial'

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
      name: 'headerMedia',
      title: 'Header Media',
      description: 'Media module',
      type: media.name,
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'aboutText',
      title: 'About Text',
      description: 'Editorial module',
      type: 'object',
      group: 'content',
      validation: (rule) => rule.required(),
      fields: [
        defineField({type: 'string', title: 'Title', name: 'title'}),
        defineField({type: 'text', title: 'Content', name: 'content'}),
      ],
    }),
    defineField({
      name: 'consignmentForm',
      title: 'Consignment Form',
      type: dzConsignment.name,
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featuredMedia',
      title: 'Featured Media',
      description: 'Media module',
      type: media.name,
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField(
      Interstitial.builder(
        {
          name: 'interstitial',
          title: 'Interstitial',
          description: 'Interstitial module',
          group: 'content',
          validation: (rule: ObjectRule) => rule.required(),
        },
        {excludeFields: ['subtitle']}
      )
    ),
    defineField({
      name: 'body',
      title: 'Body',
      description: 'Media and editorial modules',
      type: 'array',
      group: 'content',
      validation: (rule) => rule.required().length(5),
      of: [
        defineArrayMember({
          name: 'element',
          title: 'Element',
          type: 'object',
          preview: {
            select: {
              title: 'text.title',
              media: 'image',
            },
          },
          fields: [
            defineField({
              type: 'image',
              name: 'image',
              fields: [defineField({name: 'alt', title: 'Alternative text', type: 'string'})],
              options: {hotspot: true},
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'text',
              type: 'object',
              title: 'Text',
              validation: (rule) => rule.required(),
              fields: [
                defineField({type: 'string', title: 'Title', name: 'title'}),
                defineField({type: 'text', title: 'Content', name: 'content'}),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'bodyCarousel',
      title: 'Body Carousel',
      description: 'Carousel module',
      type: 'array',
      group: 'content',
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: artist.name}],
          title: 'Artist',
        }),
      ],
    }),
    defineField(
      Interstitial.builder(
        {
          name: 'footerInterstitial',
          title: 'Interstitial',
          description: 'Interstitial module',
          group: 'content',
          validation: (rule: ObjectRule) => rule.required(),
        },
        {excludeFields: ['subtitle']}
      )
    ),
  ],
})
