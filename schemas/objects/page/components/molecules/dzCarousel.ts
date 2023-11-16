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
  carouselSizes?: (string | {value: string; title: string})[]
  hideComponentTitle?: boolean
  hideSize?: boolean
  componentOptions?: any
  optionalComponent?: boolean
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
const DEFAULT_SIZES = [{value: 'XL', title: 'XL'}, 'L', 'M', 'S']

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
      hidden: () => options?.hideComponentTitle ?? false,
      initialValue: 'Carousel',
    }),
    ...(!options?.hideSize
      ? [
          defineField({
            name: 'size',
            type: 'string',
            title: 'Size',
            options: {list: options.carouselSizes ? options.carouselSizes : DEFAULT_SIZES},
            validation: options?.optionalComponent ? undefined : (rule) => rule.required(),
          }),
        ]
      : []),
    {
      type: 'array',
      icon: MasterDetailIcon,
      of: getComponents(
        options?.components ?? Object.values(CarouselComponents),
        options.references,
        options.referencesFilter,
      ),
      name: 'dzCarousel',
      ...options?.componentOptions,
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
