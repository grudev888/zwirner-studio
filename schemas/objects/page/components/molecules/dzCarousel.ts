import {defineField, defineType} from 'sanity'
import {MasterDetailIcon} from '@sanity/icons'

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
