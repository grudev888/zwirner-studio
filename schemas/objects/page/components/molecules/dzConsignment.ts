import {defineField} from 'sanity'
import {ComposeIcon, EditIcon} from '@sanity/icons'

export default defineField({
  name: 'dzConsignment',
  title: 'Consignment',
  type: 'object',
  groups: [
    {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
    {name: 'overrides', title: 'Overrides', icon: EditIcon},
  ],
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      group: 'content',
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
