import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'painting',
  title: 'Painting',
  type: 'object',
  fields: [
    defineField({
      name: 'abstract',
      title: 'abstract',
      type: 'text',
      description: 'An abstract is a short description that summarizes a CreativeWork.',
    }),
  ],
})