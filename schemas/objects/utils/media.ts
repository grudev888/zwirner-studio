import {FieldDefinition, ObjectRule, SchemaTypeDefinition, defineField, defineType} from 'sanity'
import {capitalize} from '../../../lib/util/strings'
import {getPropFromPath} from '../../../lib/util/sanity'
import {mediaAssetSource} from 'sanity-plugin-media'
import {PresentationIcon} from '@sanity/icons'
import * as Video from './video'

export enum MediaTypes {
  IMAGE = 'Image',
  VIDEO = 'Custom Video',
  VIDEO_RECORD = 'Video Record',
  UNSET = 'Unset',
}

export type MediaOptions = {
  type?: MediaTypes
  video?: Video.MediaOptions
  image?: {additionalFields?: FieldDefinition[]}
  required?: boolean
}

export const builder = (
  params: {name: string; title: string; [key: string]: any},
  options?: MediaOptions,
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
      hidden: !!options?.type,
      options: {
        list: Object.values(MediaTypes)
          .filter((type) => (!!options?.type ? type === options?.type : true))
          .map((type) => ({title: capitalize(type), value: type})),
      },
      initialValue: options?.type || MediaTypes.UNSET,
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
        if (value.type === MediaTypes.VIDEO && !value.video && !value.externalVideo) {
          return {message: `Required`}
        }

        return true
      }),
  ],
})

export default defineType(builder({name: 'media', title: 'Media'})) as SchemaTypeDefinition
