import {WrenchIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'eComm',
  title: 'E-Comm',
  type: 'document',
  icon: WrenchIcon,
  preview: {prepare: () => ({title: 'E-Comm Setting'})},
  fields: [
    defineField({
      name: 'disableEcomm',
      title: 'Disable E-Comm for ADP Launch',
      type: 'boolean',
    }),
  ],
})
