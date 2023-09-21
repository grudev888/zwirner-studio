import {SchemaTypeDefinition, defineField, defineType} from 'sanity'
import {capitalize} from '../../../lib/util/strings'
import {PresentationIcon} from '@sanity/icons'

export enum MediaTypes {
  MOVING_IMAGE = 'Moving Image',
  INTERACTIVE_VIDEO = 'Interactive Video',
}

export type MediaOptions = {
  type?: MediaTypes
  enabledSelection?: boolean
}

export const builder = (
  params: {name: string; title: string; [key: string]: any},
  options?: MediaOptions,
) => ({
  type: 'object',
  options: {collapsible: false},
  icon: PresentationIcon,
  fields: [
    defineField({
      name: 'type',
      title: 'Video Type',
      type: 'string',
      initialValue: options?.type,
      hidden: !options?.enabledSelection,
      options: {
        list: Object.values(MediaTypes)
          .filter((type) => (!!options?.type ? type === options?.type : true))
          .map((type) => ({title: capitalize(type), value: type})),
      },
    }),
    defineField({
      name: 'videoReference',
      title: ' ',
      type: 'reference',
      to: [{type: 'video'}],
    }),
  ],
  ...params,
})

export default defineType(builder({name: 'videoMedia', title: 'Video'})) as SchemaTypeDefinition
