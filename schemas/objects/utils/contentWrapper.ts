import {MasterDetailIcon} from '@sanity/icons'
import {
  ObjectDefinition,
  defineArrayMember,
  defineField,
  defineType,
  RuleBuilder,
  SchemaTypeDefinition,
} from 'sanity'
import * as Video from './video'

export const builder = (
  params: {name: string; title: string; [key: string]: any} = {
    name: 'contentWrap',
    title: 'Linked Content',
  },
  options: {
    references: SchemaTypeDefinition[]
    video?: Video.MediaOptions
    validation?: RuleBuilder<any>
  },
) => ({
  type: 'object',
  icon: MasterDetailIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Content Title',
    }),
    defineField(
      Video.builder(
        {
          name: 'videoOverride',
          title: 'Moving Image Video',
        },
        ...[options?.video],
      ),
    ),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      icon: MasterDetailIcon,
      validation: options.validation,
      of: options.references.map((reference) =>
        defineArrayMember({
          name: reference.name,
          title: reference.title,
          type: 'reference',
          to: [{type: reference.name}],
        }),
      ),
    }),
  ],
  ...params,
})

export default defineType(
  builder({name: 'contentWrap', title: 'Linked Content'}, {references: []}),
) as ObjectDefinition
