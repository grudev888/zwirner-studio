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
  groups: [
    {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
    {name: 'overrides', title: 'Overrides', icon: EditIcon},
    {name: 'attributes', title: 'Attributes', icon: MasterDetailIcon, default: false},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Component title',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: 'array',
      name: 'content',
      title: 'Content',
      of: [defineArrayMember({type: dzCard.name})],
    }),
    defineField({
      name: 'enableOverrides',
      type: 'boolean',
      title: 'Enable Overrides',
      group: 'overrides',
      initialValue: false,
    }),
    defineField({
      name: 'slidesPerViewDesktop',
      type: 'number',
      title: 'Slides per view - Desktop',
      group: 'attributes',
      initialValue: 5,
    }),
    defineField({
      name: 'slidesPerViewMobile',
      type: 'number',
      title: 'Slides per view - Mobile',
      group: 'attributes',
      initialValue: 1,
    }),
  ],
})
