import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import * as Media from '../objects/utils/media'

export default defineType({
  name: 'author',
  title: 'Authors',
  icon: UserIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField(
      Media.builder(
        {
          name: 'picture',
          title: 'Author Picture',
        },
        {
          type: Media.MediaTypes.IMAGE,
        },
      ),
    ),
  ],
})
