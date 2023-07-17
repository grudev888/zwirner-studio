import {defineArrayMember, defineField, defineType} from 'sanity'

import {menuCommonFields} from '../utils/menu'

export default defineType({
  name: 'menu',
  title: 'Menu',
  type: 'object',
  fields: [
    defineField({
      type: 'array',
      name: 'items',
      title: 'Items',
      of: [
        defineArrayMember({type: 'menuItemPage', name: 'menuItemPage'}),
        defineArrayMember({type: 'menuItemLink', name: 'menuItemLink'}),
        defineArrayMember({
          type: 'object',
          name: 'menuItemSubmenu',
          title: 'Menu Item',
          preview: {select: {title: 'title'}},
          fields: [
            defineField({type: 'string', name: 'title', title: 'Title'}),
            defineField({
              type: 'array',
              name: 'rootLink',
              title: 'Menu Link',
              validation: (rule) => rule.length(1),
              of: [
                defineArrayMember({type: 'menuItemPage', name: 'menuItemPage'}),
                defineArrayMember({type: 'menuItemLink', name: 'menuItemLink'}),
              ],
            }),
            defineField({
              name: 'submenu',
              title: 'Submenu',
              type: 'menu',
            }),
            ...menuCommonFields,
          ],
        }),
      ],
    }),
  ],
})
