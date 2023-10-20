import {defineType, defineField} from 'sanity'
import {RobotIcon} from '@sanity/icons'

export default defineType({
  name: 'curator',
  title: 'Curator',
  icon: RobotIcon,
  type: 'document',
  preview: {
    select: {title: 'name'},
    prepare: ({title}) => ({title, media: RobotIcon}),
  },
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
})
