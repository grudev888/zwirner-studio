// Todo with the design system version update
// import {EditorialTextType} from '@zwirner/design-system'
import {defineField, defineType} from 'sanity'
import blockContentSimple from './blockContentSimple'

export interface TextComplexSchemaType {
  text: string
  textType: any
}

export default defineType({
  title: 'Text complex',
  name: 'textComplex',
  type: 'object',
  preview: {select: {title: 'text'}},
  fields: [
    defineField({
      title: 'Type',
      name: 'textType',
      type: 'string',
      options: {
        list: [
          {title: 'Paragraph', value: 'paragraph'},
          {title: 'Quote', value: 'quote'},
        ],
      },
      initialValue: 'simple',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'text',
      type: 'array',
      of: blockContentSimple,
      validation: (rule) => rule.required(),
    }),
  ],
})
