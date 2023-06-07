import {FieldDefinition, defineField, defineType} from 'sanity'
import {capitalize} from '../../../lib/util/strings'
import {getPropFromPath} from '../../../lib/util/sanity'

export enum MEDIA_TYPES {
  IMAGE = 'image',
  VIDEO = 'video',
}

export enum VIDEO_PROVIDERS {
  vimeo = 'vimeo',
  youtube = 'youtube',
  custom = 'custom',
}

export type MediaOptions = {
  type?: MEDIA_TYPES
  video?: {providers?: VIDEO_PROVIDERS[]}
  image?: {additionalFields?: FieldDefinition[]}
}

export const builder = (
  params: {name: string; title: string; [key: string]: any},
  options?: MediaOptions
) => ({
  type: 'object',
  preview: {select: {media: 'image', title: 'image.alt'}},
  options: {collapsible: false},
  fields: [
    defineField({
      name: 'type',
      title: 'Media Type',
      type: 'string',
      initialValue: options?.type,
      hidden: !!options?.type,
      options: {
        list: Object.values(MEDIA_TYPES)
          .filter((type) => (!!options?.type ? type === options?.type : true))
          .map((type) => ({title: capitalize(type), value: type})),
      },
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true, collapsible: false},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          validation: (rule) => {
            return rule.custom((value, context) => {
              if (!context.document || !context.path) return true
              const parent = getPropFromPath(context.document, context.path?.slice(0, -2))
              return parent.type === MEDIA_TYPES.IMAGE && !value ? 'Required' : true
            })
          },
        }),
        defineField({
          name: 'url',
          type: 'string',
          title: 'Url Redirect',
        }),
        ...(options?.image?.additionalFields || []),
      ],
      hidden: ({parent}) => parent?.type === MEDIA_TYPES.VIDEO || !parent?.type,
    }),
    defineField({
      name: 'provider',
      title: 'Provider',
      type: 'string',
      options: {list: options?.video?.providers || Object.values(VIDEO_PROVIDERS)},
      hidden: ({parent}) => parent?.type === MEDIA_TYPES.IMAGE || !parent?.type,
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'file',
      options: {accept: 'video/mp4,video/x-m4v,video/*'},
      hidden: ({parent}) =>
        parent?.type === MEDIA_TYPES.IMAGE || !parent?.type || parent?.provider !== 'custom',
    }),
    defineField({
      name: 'externalVideo',
      title: 'Video URL',
      type: 'url',
      hidden: ({parent}) =>
        parent?.type === MEDIA_TYPES.IMAGE ||
        !parent?.type ||
        !['vimeo', 'youtube'].includes(parent?.provider),
    }),
  ],
  ...params,
})

export default defineType(builder({name: 'media', title: 'Media'}))
