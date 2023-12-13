import {FieldDefinition, ObjectRule, SchemaTypeDefinition, defineField, defineType} from 'sanity'
import {capitalize} from '../../../lib/util/strings'
import blockContentSimple from '../utils/blockContentSimple'
import {mediaAssetSource} from 'sanity-plugin-media'
import {PresentationIcon, DocumentVideoIcon} from '@sanity/icons'
import * as Video from './video'
import {backgroundColorParams} from './backgroundColor'

export enum MediaTypes {
  IMAGE = 'Image',
  VIDEO = 'Custom Video',
  VIDEO_RECORD = 'Video Record',
  UNSET = 'Unset',
}

export type MediaOptions = {
  type?: MediaTypes
  defaultUnset?: boolean
  video?: Video.MediaOptions
  image?: {additionalFields?: FieldDefinition[]}
  required?: boolean
  backgroundColor?: boolean
}

export const builder = (
  params: {name: string; title: string; [key: string]: any},
  options?: MediaOptions,
) => ({
  type: 'object',
  preview: {select: {media: 'image', title: 'image.alt'}},
  options: {collapsible: false},
  icon:
    options?.type === MediaTypes.VIDEO_RECORD || options?.type === MediaTypes.VIDEO
      ? DocumentVideoIcon
      : PresentationIcon,
  fields: [
    defineField({
      name: 'type',
      title: 'Media Type',
      type: 'string',
      // hidden: !!options?.type,
      options: {
        list: Object.values(MediaTypes)
          .filter((type) =>
            !!options?.type ? type === options?.type || type === MediaTypes.UNSET : true,
          )
          .map((type) => ({title: capitalize(type), value: type})),
      },
      initialValue: options?.type && !options?.defaultUnset ? options?.type : MediaTypes.UNSET,
    }),
    defineField(
      Video.builder(
        {
          name: 'videoSelectorReference',
          title: 'Video Reference',
          hidden: ({parent}: any) =>
            parent?.type === MediaTypes.IMAGE ||
            parent?.type === MediaTypes.VIDEO ||
            !parent?.type ||
            parent?.type === MediaTypes.UNSET ||
            options?.type === MediaTypes.VIDEO ||
            options?.type === MediaTypes.IMAGE,
        },
        ...[options?.video],
      ),
    ),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {collapsible: false, sources: [mediaAssetSource]},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          hidden: true,
        }),
        defineField({
          name: 'url',
          type: 'string',
          title: 'Url Redirect',
        }),
        ...(options?.image?.additionalFields || []),
      ],
      hidden: ({parent}) =>
        parent?.type === MediaTypes.VIDEO ||
        parent?.type === MediaTypes.VIDEO_RECORD ||
        options?.type === MediaTypes.VIDEO ||
        options?.type === MediaTypes.VIDEO_RECORD ||
        parent?.type === MediaTypes.UNSET ||
        !parent?.type,
    }),
    defineField({
      ...backgroundColorParams,
      hidden: ({parent}) =>
        !options?.backgroundColor ||
        parent?.type === MediaTypes.VIDEO ||
        parent?.type === MediaTypes.VIDEO_RECORD ||
        options?.type === MediaTypes.VIDEO ||
        options?.type === MediaTypes.VIDEO_RECORD ||
        parent?.type === MediaTypes.UNSET ||
        !parent?.type,
    }),
    defineField({
      name: 'caption',
      type: 'array',
      title: 'Caption',
      of: blockContentSimple,
      hidden: ({parent}) =>
        parent?.type === MediaTypes.VIDEO ||
        parent?.type === MediaTypes.VIDEO_RECORD ||
        options?.type === MediaTypes.VIDEO ||
        options?.type === MediaTypes.VIDEO_RECORD ||
        parent?.type === MediaTypes.UNSET ||
        !parent?.type,
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'file',
      // https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Containers
      options: {accept: 'video/mp4, video/ogg, video/webm', sources: [mediaAssetSource]},
      hidden: ({parent}) =>
        parent?.type === MediaTypes.IMAGE ||
        parent?.type === MediaTypes.VIDEO_RECORD ||
        options?.type === MediaTypes.IMAGE ||
        options?.type === MediaTypes.VIDEO_RECORD ||
        parent?.type === MediaTypes.UNSET ||
        !parent?.type,
    }),
  ],
  ...params,
  validation: (rule: ObjectRule) => [
    ...((Array.isArray(params.validation) ? params.validation : [params.validation]) || []),
    options?.required === true &&
      rule.custom((value: any) => {
        if (!value) return {message: `${params.name} is required`}

        if (value.type === MediaTypes.IMAGE && !value.image?.asset) return {message: `Required`}
        if (value.type === MediaTypes.VIDEO && !value.video) {
          return {message: `Required`}
        }

        return true
      }),
  ],
})

export default defineType(builder({name: 'media', title: 'Media'})) as SchemaTypeDefinition
