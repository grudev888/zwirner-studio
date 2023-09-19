// Todo with the design system version update
import {defineField, defineType, ObjectDefinition} from 'sanity'
import blockContentSimple from './blockContentSimple'

export interface TextComplexSchemaType {
  text: string
  textType: any
}

export enum ComplexTextTypes {
  FULL = 'full',
  SINGLE = 'single',
}

export const builder = (
  params: {name: string; title: string; [key: string]: any} = {
    name: 'textComplex',
    title: 'Text complex',
  },
  options: {type: ComplexTextTypes},
) => {
  if (options.type === ComplexTextTypes.SINGLE) {
    return {
      type: 'array',
      of: blockContentSimple,
      ...params,
    }
  }

  return {
    type: 'object',
    preview: {select: {title: 'text'}},
    fields: [
      defineField({
        title: 'Type',
        name: 'textType',
        type: 'string',
        options: {
          list: [
            {title: 'Paragraph', value: 'paragraph'},
            {title: 'Quote', value: 'quote'},
          ],
        },
        initialValue: 'simple',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'text',
        type: 'array',
        of: blockContentSimple,
        validation: (rule) => rule.required(),
      }),
    ],
    ...params,
  }
}

export default defineType(
  builder({name: 'textComplex', title: 'Text complex'}, {type: ComplexTextTypes.FULL}),
) as ObjectDefinition
