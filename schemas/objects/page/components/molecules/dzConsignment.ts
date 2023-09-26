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
      options: {hotspot: true, collapsible: false},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          hidden: true,
        }),
      ],
    }),
  ],
})
