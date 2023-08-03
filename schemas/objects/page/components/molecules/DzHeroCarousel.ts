import {ComposeIcon, EditIcon, MasterDetailIcon} from '@sanity/icons'
import {
  defineArrayMember,
  defineField,
  defineType,
  ObjectDefinition,
  SchemaTypeDefinition,
} from 'sanity'
import artist from '../../../../documents/artist'
import artwork from '../../../../documents/artwork'
import exhibitionPage from '../../../../documents/pages/exhibitionPage'

export interface DzHeroCarouselSchemaProps {
  title: string
  headingOverride?: string
  pictures?: any
  enableOverrides: boolean
}

export const builder = (
  params: {name: string; title: string; [key: string]: any} = {
    name: 'dzHeroCarousel',
    title: 'Hero Carousel',
  },
  options: {references: SchemaTypeDefinition[]}
) => ({
  type: 'object',
  icon: MasterDetailIcon,
  groups: [
    {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
    {name: 'overrides', title: 'Overrides', icon: EditIcon},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'content',
      title: 'Component title',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      group: 'content',
      type: 'array',
      icon: MasterDetailIcon,
      of: options.references.map((reference) =>
        defineArrayMember({
          name: reference.name,
          title: reference.title,
          type: 'reference',
          to: [{type: reference.name}],
        })
      ),
    }),
    defineField({
      name: 'enableOverrides',
      type: 'boolean',
      title: 'Enable Overrides',
      group: 'overrides',
      initialValue: false,
    }),
    defineField({
      name: 'headingOverride',
      type: 'string',
      title: 'Heading',
      group: 'overrides',
    }),
    defineField({
      title: 'Pictures',
      name: 'pictures',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            },
          ],
        }),
      ],
      options: {
        layout: 'grid',
      },
    }),
  ],
  ...params,
})

export default defineType(
  builder(
    {name: 'dzHeroCarousel', title: 'Hero Carousel'},
    {references: [artist, artwork, exhibitionPage]}
  )
) as ObjectDefinition
