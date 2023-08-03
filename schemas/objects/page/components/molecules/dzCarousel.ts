import {
  defineField,
  defineType,
  ObjectDefinition,
  defineArrayMember,
  SchemaTypeDefinition,
} from 'sanity'
import {MasterDetailIcon} from '@sanity/icons'
import artist from '../../../../documents/artist'
import artwork from '../../../../documents/artwork'
import exhibitionPage from '../../../../documents/pages/exhibitionPage'

export interface DzCarouselSchemaProps {
  title: string
  enableOverrides: boolean
}

export const builder = (
  params: {name: string; title: string; [key: string]: any} = {
    name: 'dzCarousel',
    title: 'Carousel',
  },
  options: {references: SchemaTypeDefinition[]}
) => ({
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
      name: 'content',
      title: 'Content',
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
  ],
  ...params,
})

export default defineType(
  builder({name: 'dzCarousel', title: 'Carousel'}, {references: [artist, artwork, exhibitionPage]})
) as ObjectDefinition
