import {ComposeIcon, EditIcon, SquareIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'dzButton',
  title: 'Button',
  type: 'object',
  icon: SquareIcon,
  groups: [
    {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
    {name: 'overrides', title: 'Overrides', icon: EditIcon},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'enableOverrides',
      type: 'boolean',
      title: 'Enable Overrides',
      group: 'overrides',
      initialValue: false,
    }),
    defineField({
      name: 'titleOverride',
      type: 'string',
      title: 'Title',
      group: 'overrides',
    }),
  ],
})
