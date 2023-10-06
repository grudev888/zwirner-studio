import {MasterDetailIcon} from '@sanity/icons'
import {ArrayOfType, ObjectDefinition, defineArrayMember, defineField, defineType} from 'sanity'
import artist from '../../../../documents/artist'
import artwork from '../../../../documents/artwork'
import exhibitionPage from '../../../../documents/pages/exhibitionPage'
import cta from '../../../utils/cta'

export type Reference = ArrayOfType & {name: string}

const fields = (references: Reference[]) => [
  defineField({
    name: 'content',
    title: 'Content',
    type: 'array',
    icon: MasterDetailIcon,
    validation: (rule) => rule.max(1),
    of: references.map((reference) =>
      defineArrayMember({
        name: reference.name,
        title: reference.title,
        type: 'reference',
        to: [{type: reference.name}],
      })
    ),
  }),
  defineField({
    name: 'image',
    type: 'image',
    title: 'Image',
    fields: [{name: 'alt', type: 'string', title: 'Alternative text', hidden: true}],
  }),
  defineField({name: 'category', type: 'string', title: 'Category'}),
  defineField({name: 'heading', type: 'string', title: 'Title'}),
  defineField({name: 'subHeading', type: 'string', title: 'Subtitle'}),
  defineField({name: 'secondaryTitle', type: 'string', title: 'Secondary Title'}),
  defineField({name: 'description', type: 'string', title: 'Description'}),
  defineField({name: 'cta', type: cta.name, title: 'CTA'}),
]

export const builder = (
  params: {name: string; title: string; [key: string]: any},
  options?: {references?: Reference[]; excludeFields?: string[]}
) => {
  const references = options?.references || ([artist, artwork, exhibitionPage] as Reference[])
  const excludeFields = options?.excludeFields || []

  return {
    type: 'object',
    icon: MasterDetailIcon,
    fields: fields(references).filter((field) => !excludeFields.includes(field.name)),
    ...params,
  }
}

export default defineType(builder({name: 'hero', title: 'Hero'})) as ObjectDefinition
