import {defineField, defineType} from 'sanity'

export default defineType({
  type: 'object',
  name: 'splitModule',
  title: 'Split Module',
  fields: [
    defineField({
      type: 'image',
      name: 'image',
      title: 'Image',
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: 'string',
      title: 'Title',
      name: 'title',
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: 'text',
      name: 'text',
      title: 'Text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: 'url',
      name: 'url',
      title: 'URL',
      validation: (rule) => rule.required().uri({allowRelative: true}),
    }),
  ],
})
