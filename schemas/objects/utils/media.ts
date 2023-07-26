import {FieldDefinition, ObjectRule, SchemaTypeDefinition, defineField, defineType} from 'sanity'
import {capitalize} from '../../../lib/util/strings'
import {getPropFromPath} from '../../../lib/util/sanity'
import {mediaAssetSource} from 'sanity-plugin-media'
import {PresentationIcon} from '@sanity/icons'

export enum MediaTypes {
  IMAGE = 'image',
  VIDEO = 'video',
}

export enum VideoProviders {
  vimeo = 'vimeo',
  youtube = 'youtube',
  custom = 'custom',
}

export type MediaOptions = {
  type?: MediaTypes
  video?: {providers?: VideoProviders[]}
  image?: {additionalFields?: FieldDefinition[]}
  required?: boolean
}

export const builder = (
  params: {name: string; title: string; [key: string]: any},
  options?: MediaOptions
) => ({
  type: 'object',
  preview: {select: {media: 'image', title: 'image.alt'}},
  options: {collapsible: false},
  icon: PresentationIcon,
  fields: [
    defineField({
      name: 'type',
      title: 'Media Type',
      type: 'string',
      initialValue: options?.type,
      hidden: !!options?.type,
      options: {
        list: Object.values(MediaTypes)
          .filter((type) => (!!options?.type ? type === options?.type : true))
          .map((type) => ({title: capitalize(type), value: type})),
      },
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true, collapsible: false, sources: [mediaAssetSource]},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          validation: (rule) => {
            return rule.custom((value, context) => {
              if (!context.document || !context.path) return true
              const parent = getPropFromPath(context.document, context.path?.slice(0, -2))
              return parent.type === MediaTypes.IMAGE && !value ? 'Required' : true
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
      hidden: ({parent}) => parent?.type === MediaTypes.VIDEO || !parent?.type,
    }),
    defineField({
      name: 'provider',
      title: 'Provider',
      type: 'string',
      options: {list: options?.video?.providers || Object.values(VideoProviders)},
      hidden: ({parent}) => parent?.type === MediaTypes.IMAGE || !parent?.type,
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'file',
      options: {accept: 'video/mp4,video/x-m4v,video/*'},
      hidden: ({parent}) =>
        parent?.type === MediaTypes.IMAGE || !parent?.type || parent?.provider !== 'custom',
    }),
    defineField({
      name: 'externalVideo',
      title: 'Video URL',
      type: 'url',
      hidden: ({parent}) =>
        parent?.type === MediaTypes.IMAGE ||
        !parent?.type ||
        !['vimeo', 'youtube'].includes(parent?.provider),
    }),
    defineField({
      name: 'podcastLink',
      title: 'Podcast Iframe URL',
      type: 'url',
      hidden: ({parent}) => parent?.type === MediaTypes.IMAGE || parent?.type === MediaTypes.VIDEO,
    }),
  ],
  ...params,
  validation: (rule: ObjectRule) => [
    ...((Array.isArray(params.validation) ? params.validation : [params.validation]) || []),
    options?.required === true &&
      rule.custom((value: any) => {
        if (!value) return {message: `${params.name} is required`}

        if (value.type === MediaTypes.IMAGE && !value.image?.asset) return {message: `Required`}
        if (value.type === MediaTypes.VIDEO && !value.video && !value.externalVideo) {
          return {message: `Required`}
        }

        return true
      }),
  ],
})

export default defineType(builder({name: 'media', title: 'Media'})) as SchemaTypeDefinition
