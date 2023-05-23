import {MasterDetailIcon, ComposeIcon} from '@sanity/icons'
import {defineField, ObjectDefinition} from 'sanity'

export const withComponentId = (schema: ObjectDefinition) => ({
  ...schema,
  groups: [
    ...(schema.groups || []),
    {name: 'attributes', title: 'Attributes', icon: MasterDetailIcon, default: false},
  ],
  fields: [
    ...schema.fields,
    defineField({
      name: 'componentId',
      type: 'slug',
      title: 'Component id',
      description:
        'This will allow you to create an anchor on this component. Make sure this ID is unique within this page.',
      group: 'attributes',
    }),
  ],
})

export const defineCarouselField = (schema: any) => {
  if (schema.type !== 'object') throw new Error('Carousel fields should be objects')

  const attributesGroup = schema.groups?.find(({name}: {name: string}) => name === 'attributes')
  const contentGroup = schema.groups?.find(({name}: {name: string}) => name === 'content')

  return {
    ...schema,
    groups: [
      ...(schema.groups || []),
      !contentGroup && {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
      !attributesGroup && {name: 'attributes', title: 'Attributes', icon: MasterDetailIcon},
    ],
    fields: [
      ...schema.fields.map((field: any) => ({...field, group: field.group || 'content'})),
      defineField({
        name: 'slidesPerView',
        title: 'Slides per view',
        type: 'number',
        initialValue: 4,
        group: 'attributes',
        validation: (rule) => rule.required().min(1),
      }),
    ],
  }
}

export const defineGridField = (schema: any) => {
  if (schema.type !== 'object') throw new Error('Carousel fields should be objects')

  const attributesGroup = schema.groups?.find(({name}: {name: string}) => name === 'attributes')
  const contentGroup = schema.groups?.find(({name}: {name: string}) => name === 'content')

  return {
    ...schema,
    groups: [
      ...(schema.groups || []),
      !contentGroup && {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
      !attributesGroup && {name: 'attributes', title: 'Attributes', icon: MasterDetailIcon},
    ],
    fields: [
      ...schema.fields.map((field: any) => ({...field, group: field.group || 'content'})),
      defineField({
        name: 'itemsPerRow',
        title: 'Items per row',
        type: 'number',
        initialValue: 4,
        group: 'attributes',
        options: {layout: 'dropdown', list: [1, 2, 3, 4]},
        validation: (rule) => rule.required().min(1),
      }),
    ],
  }
}
