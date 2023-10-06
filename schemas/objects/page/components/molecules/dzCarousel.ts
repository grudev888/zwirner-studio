import {defineField, defineType, ObjectDefinition, SchemaTypeDefinition} from 'sanity'
import {MasterDetailIcon, ImagesIcon} from '@sanity/icons'
import {builder as dzCardBuilder} from './dzCard'
import {builder as dzMediaBuilder} from './dzMedia'

export interface DzCarouselSchemaProps {
  title: string
  enableOverrides: boolean
}

export enum CarouselComponents {
  dzCard = 'dzCard',
  dzMedia = 'dzMedia',
}

const componentBuilder = {
  [CarouselComponents.dzCard]: dzCardBuilder,
  [CarouselComponents.dzMedia]: dzMediaBuilder,
}

export type ReferencesFilterOptions = {
  [key in CarouselComponents]?: {[key: string]: string}
}

export type ReferencePerType = {
  [key in CarouselComponents]?: SchemaTypeDefinition[]
}
export type FullGridReferencePerType = ReferencePerType & {all?: SchemaTypeDefinition[]}
export type CarouselOptions = {
  components: CarouselComponents[]
  references: FullGridReferencePerType
  referencesFilter?: ReferencesFilterOptions
}

const getComponents = (
  list: CarouselComponents[],
  references: FullGridReferencePerType,
  referencesFilter?: ReferencesFilterOptions,
) => {
  return list.map((component: CarouselComponents) =>
    componentBuilder[component](undefined, {
      references: references[component] ?? references.all ?? [],
      referencesFilter: referencesFilter?.[component] ?? {},
    }),
  )
}

export const builder = (
  params: {name: string; title: string; [key: string]: any} = {
    name: 'dzCarousel',
    title: 'Carousel',
  },
  options: CarouselOptions,
) => ({
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Component title',
      validation: (rule) => rule.required(),
      initialValue: 'Carousel',
    }),
    defineField({
      name: 'size',
      type: 'string',
      title: 'Size',
      options: {list: [{value: 'XL', title: 'XL'}, 'L', 'M', 'S']},
    }),
    {
      type: 'array',
      icon: MasterDetailIcon,
      of: getComponents(
        options?.components ?? Object.values(CarouselComponents),
        options.references,
        options.referencesFilter,
      ),
      ...params,
    },
  ],
  ...params,
})

export default defineType(
  builder(
    {name: 'dzCarousel', title: 'Carousel'},
    {
      components: Object.values(CarouselComponents),
      references: {all: [{name: 'exhibitionPage', title: 'Exhibition'} as SchemaTypeDefinition]},
    },
  ),
) as ObjectDefinition
