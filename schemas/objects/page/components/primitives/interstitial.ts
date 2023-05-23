import {MasterDetailIcon} from '@sanity/icons'
import {ObjectDefinition, defineField, defineType} from 'sanity'
import cta from '../../../utils/cta'

const fields = [
  defineField({name: 'title', type: 'string', title: 'Title'}),
  defineField({name: 'subtitle', type: 'string', title: 'Subtitle'}),
  defineField({name: 'cta', type: cta.name, title: 'CTA'}),
  defineField({
    name: 'image',
    type: 'image',
    title: 'Background Image',
    options: {hotspot: true},
    fields: [{name: 'alt', type: 'string', title: 'Alternative text'}],
  }),
]

export const builder = (
  params: {name: string; title: string; [key: string]: any},
  options?: {excludeFields: string[]}
) => {
  const {excludeFields} = options || {excludeFields: []}
  return {
    type: 'object',
    icon: MasterDetailIcon,
    fields: fields.filter((field) => !excludeFields.includes(field.name)),
    ...params,
  }
}

export default defineType(
  builder({name: 'interstitial', title: 'Interstitial'})
) as ObjectDefinition
