import {MasterDetailIcon} from '@sanity/icons'
import {ObjectDefinition, defineField, defineType} from 'sanity'
import cta from '../../../utils/cta'
import * as Media from '../../../utils/media'

const fields = [
  defineField({name: 'title', type: 'string', title: 'Primary Title'}),
  defineField({
    name: 'eyebrow',
    type: 'string',
    title: 'Eyebrow',
  }),
  defineField({name: 'subtitle', type: 'string', title: 'Description'}),
  // (Interstitial) Supported Modules for “Moving Images” ONLY
  defineField(
    Media.builder(
      {
        name: 'image',
        title: 'Interstitial Media',
      },
      {
        type: Media.MediaTypes.IMAGE,
      },
    ),
  ),
  defineField({name: 'cta', type: cta.name, title: 'CTA'}),

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
