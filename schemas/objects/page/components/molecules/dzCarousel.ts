import {ComposeIcon, EditIcon, MasterDetailIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import dzCard from './dzCard'

export interface DzCarouselSchemaProps {
  title: string
  enableOverrides: boolean
}

export default defineType({
  name: 'dzCarousel',
  title: 'Carousel',
  type: 'object',
  icon: MasterDetailIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Component title',
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: 'array',
      name: 'content',
      title: 'Content',
      type: 'pageContent',
    }),
  ],
})
