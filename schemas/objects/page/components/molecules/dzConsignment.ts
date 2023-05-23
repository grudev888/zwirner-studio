import {defineField} from 'sanity'

export default defineField({
  name: 'dzConsignment',
  title: 'Consignment',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          validation: (rules) => rules.required(),
        }),
      ],
    }),
  ],
})
