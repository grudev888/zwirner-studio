import {CogIcon} from '@sanity/icons'
import {defineField, defineType, ObjectRule} from 'sanity'
import * as Media from '../objects/utils/media'

export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  preview: {select: {title: 'title', subtitle: 'description'}},
  fields: [
    defineField(
      Media.builder(
        {
          name: 'newsletterImage',
          title: 'Newsletter Image',
          validation: (rule: ObjectRule) => rule.required(),
          options: {
            collapsible: true,
          },
        },
        {type: Media.MediaTypes.IMAGE},
      ),
    ),
  ],
})
