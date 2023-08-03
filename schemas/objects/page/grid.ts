import {MasterDetailIcon} from '@sanity/icons'
import {
  defineArrayMember,
  defineField,
  defineType,
  ObjectDefinition,
  SchemaTypeDefinition,
} from 'sanity'
import artist from '../../documents/artist'
import artwork from '../../documents/artwork'
import exhibitionPage from '../../documents/pages/exhibitionPage'

export interface GridMoleculeTypeProps {
  title: string
  masonryGrid: boolean
  wrap: boolean
  itemsPerRow: number
  sortField: 'date' | 'lastName' | 'title'
  sortOrder: 'asc' | 'desc'
}

export const builder = (
  params: {name: string; title: string; [key: string]: any} = {
    name: 'grid',
    title: 'Grid',
  },
  options: {references: SchemaTypeDefinition[]}
) => ({
  type: 'object',
  icon: MasterDetailIcon,
  options: {
    collapsible: true,
    collapsed: false,
  },
  fieldsets: [
    {
      name: 'sortingFilters',
      title: 'Sorting',
      options: {
        collapsible: true,
        collapsed: true,
        columns: 2,
      },
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Section name',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'masonryGrid',
      type: 'boolean',
      title: 'Masonry grid',
      description: 'Enable masonry grid layout',
      validation: (rule) => rule.required(),
      initialValue: false,
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
    defineField({
      name: 'sortField',
      title: 'Sort Field',
      description: 'Sorting field',
      type: 'string',
      fieldset: 'sortingFilters',
      options: {
        list: [
          {title: 'Date', value: 'date'},
          {title: 'Last Name', value: 'lastName'},
          {title: 'Title', value: 'title'},
        ],
      },
      initialValue: 'date',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      description: 'Ascending or descending order',
      type: 'string',
      options: {
        list: [
          {title: 'Ascending', value: 'asc'},
          {title: 'Descending', value: 'desc'},
        ],
      },
      fieldset: 'sortingFilters',
      initialValue: 'asc',
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
  builder({name: 'grid', title: 'Grid'}, {references: [artist, artwork, exhibitionPage]})
) as ObjectDefinition
