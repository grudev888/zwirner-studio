import {MasterDetailIcon} from '@sanity/icons'
import {ObjectDefinition, defineField, defineType} from 'sanity'

const fields = [
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
    name: 'cta',
    type: 'string',
    title: 'CTA Text',
  }),
  defineField({
    name: 'ctaAction',
    type: 'string',
    title: 'CTA Type',
    options: {list: ['Newsletter', 'Link']},
  }),
  defineField({
    name: 'ctaLink',
    type: 'object',
    title: 'CTA Link',
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
    title: 'Background Image',
    options: {hotspot: true},
    fields: [
      {
        name: 'alt',
        type: 'string',
        title: 'Alternative text',
      },
    ],
  }),
]

export const builder = (params = {}, options?: {excludeFields: string[]}) => {
  const {excludeFields} = options || {excludeFields: []}
  return {
    name: 'interstitial',
    title: 'Interstitial',
    type: 'object',
    icon: MasterDetailIcon,
    fields: fields.filter((field) => !excludeFields.includes(field.name)),
    ...params,
  }
}

export default defineType(builder()) as ObjectDefinition
