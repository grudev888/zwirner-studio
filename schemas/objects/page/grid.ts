import {MasterDetailIcon} from '@sanity/icons'
import {defineField, defineType, StringRule, ObjectDefinition, SchemaTypeDefinition} from 'sanity'
import {builder as dzCardBuilder} from '../page/components/molecules/dzCard'
import {builder as dzMediaBuilder} from '../page/components/molecules/dzMedia'

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
  hideComponentTitle?: boolean
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
  icon: MasterDetailIcon,
  options: {
    collapsible: true,
    collapsed: false,
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Section name',
      ...(!options?.hideComponentTitle ? {validation: (rule: StringRule) => rule.required()} : {}),
      hidden: options?.hideComponentTitle,
      initialValue: 'Grid',
    }),
    defineField({
      name: 'wrap',
      type: 'boolean',
      title: 'Wrap columns',
      description: 'Enable wrapping',
      validation: (rule) => rule.required(),
      initialValue: false,
    }),
    defineField({
      name: 'itemsPerRow',
      type: 'number',
      title: 'Items per row',
      description: 'Number of components per row',
      validation: (rule) => rule.required(),
      options: {
        list: [1, 2, 3, 4],
      },
      initialValue: 1,
    }),
    {
      type: 'array',
      icon: MasterDetailIcon,
      of: getComponents(
        options?.components ?? Object.values(GridComponents),
        options.references,
        options.referencesFilter,
      ),
      name: 'grid',
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
