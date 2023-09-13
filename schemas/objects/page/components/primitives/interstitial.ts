import {MasterDetailIcon} from '@sanity/icons'
import {ObjectDefinition, defineField, defineType} from 'sanity'
import cta from '../../../utils/cta'

const fields = [
  defineField({name: 'title', type: 'string', title: 'Primary Title'}),
  defineField({
    name: 'eyebrow',
    type: 'string',
    title: 'Eyebrow',
  }),
  defineField({name: 'subtitle', type: 'string', title: 'Description'}),
  defineField({name: 'cta', type: cta.name, title: 'CTA'}),
  defineField({
    name: 'image',
    type: 'image',
    title: 'Background Image',
    options: {hotspot: true},
    fields: [{name: 'alt', type: 'string', title: 'Alternative text'}],
  }),
  defineField({name: 'mode', type: 'string', options: {list: ['Light', 'Dark']}, title: 'Mode'}),
]

export const builder = (
  params: {name: string; title: string; [key: string]: any} = {
    name: 'dzInterstitial',
    title: 'Interstitial',
  },
  options: {excludeFields?: string[]; references?: any} = {excludeFields: [], references: []},
) => {
  const {excludeFields} = options || {excludeFields: []}
  return {
    type: 'object',
    icon: MasterDetailIcon,
    fields: fields.filter((field) => !excludeFields?.includes(field.name)),
    ...params,
  }
}

export default defineType(
  builder({name: 'interstitial', title: 'Interstitial'}),
) as ObjectDefinition
