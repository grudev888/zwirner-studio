import {ThLargeIcon, MasterDetailIcon, ComposeIcon, CheckmarkCircleIcon} from '@sanity/icons'
import {defineField, defineType, StringRule, ObjectDefinition, SchemaTypeDefinition} from 'sanity'
import {builder as dzCardBuilder} from '../page/components/molecules/dzCard'
import {builder as dzMediaBuilder} from '../page/components/molecules/dzMedia'
import {ARTWORK_NAME} from '../../documents/artwork'
import * as ContentFilters from '../utils/displayContentFilters'

export enum GridComponents {
  dzCard = 'dzCard',
  dzMedia = 'dzMedia',
}

const componentBuilder = {
  [GridComponents.dzCard]: dzCardBuilder,
  [GridComponents.dzMedia]: dzMediaBuilder,
}

export type ReferencePerType = {
  [key in GridComponents]?: SchemaTypeDefinition[]
}

export type ReferencesFilterOptions = {
  [key in GridComponents]?: {[key: string]: string}
}

export type FullGridReferencePerType = ReferencePerType & {all?: SchemaTypeDefinition[]}
export type GridOptions = {
  components: GridComponents[]
  references: FullGridReferencePerType
  referencesFilter?: ReferencesFilterOptions
  hideItemsPerRow?: boolean
  hideComponentTitle?: boolean
  gridProps?: any
}

const getComponents = (
  list: GridComponents[],
  references: FullGridReferencePerType,
  referencesFilter?: ReferencesFilterOptions,
) => {
  return list.map((component: GridComponents) =>
    componentBuilder[component](undefined, {
      references: references[component] ?? references.all ?? [],
      video: {},
      referencesFilter: referencesFilter?.[component] ?? {},
    }),
  )
}

export const builder = (
  params: {name: string; title: string; [key: string]: any} = {
    name: 'grid',
    title: 'Grid',
  },
  options: GridOptions,
) => ({
  type: 'object',
  icon: ThLargeIcon,
  options: {
    collapsible: true,
    collapsed: false,
  },
  groups: [
    {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
    {name: 'displaySettings', title: 'Artwork Display Settings', icon: CheckmarkCircleIcon},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Section name',
      group: 'content',
      ...(!options?.hideComponentTitle ? {validation: (rule: StringRule) => rule.required()} : {}),
      hidden: options?.hideComponentTitle,
      initialValue: 'Grid',
    }),
    defineField({
      name: 'wrap',
      type: 'boolean',
      title: 'Wrap columns',
      description: 'Enable wrapping',
      group: 'content',
      validation: (rule) => rule.required(),
      initialValue: false,
    }),
    defineField({
      name: 'displayNumberOfItems',
      type: 'boolean',
      title: 'Show Number of Items',
      description: 'This will show the number of items within the grid.',
      group: 'content',
      initialValue: false,
    }),
    ...(Object.values(options.references)
      .flat()
      .some((reference) => reference.name === ARTWORK_NAME)
      ? [
          ContentFilters.builder(
            {
              name: 'artworkFilters',
              title: 'Artwork Filters',
              group: 'displaySettings',
            },
            {
              type: ContentFilters.ContentMolecules.grid,
              referenceName: ARTWORK_NAME,
            },
          ),
        ]
      : []),
    defineField({
      name: 'displayGridSlider',
      type: 'boolean',
      title: 'Show Grid Slider',
      group: 'content',
      description: 'This will enable users to change the number of items per row.',
      initialValue: false,
    }),
    ...(!options?.hideItemsPerRow
      ? [
          defineField({
            name: 'itemsPerRow',
            type: 'number',
            title: 'Items per row',
            group: 'content',
            description: 'Number of components per row',
            options: {
              list: [1, 2, 3, 4],
            },
            initialValue: 1,
          }),
        ]
      : []),
    {
      type: 'array',
      icon: MasterDetailIcon,
      group: 'content',
      of: getComponents(
        options?.components ?? Object.values(GridComponents),
        options.references,
        options.referencesFilter,
      ),
      name: 'grid',
      ...options?.gridProps,
    },
  ],
  ...params,
})

export default defineType(
  builder(
    {name: 'grid', title: 'Grid'},
    {
      components: Object.values(GridComponents),
      references: {all: [{name: 'exhibitionPage', title: 'Exhibition'} as SchemaTypeDefinition]},
    },
  ),
) as ObjectDefinition
