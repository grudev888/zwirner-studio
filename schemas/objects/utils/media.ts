import {defineField, defineType} from 'sanity'

export const MEDIA_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
}

export enum VIDEO_PROVIDERS {
  vimeo = 'vimeo',
  youtube = 'youtube',
  custom = 'custom',
}

export const builder = (
  params: {name: string; title: string; [key: string]: any},
  options?: {videoProviders: VIDEO_PROVIDERS[]}
) => {
  const {videoProviders} = options || {videoProviders: Object.values(VIDEO_PROVIDERS)}
  return {
    type: 'object',
    fields: [
      defineField({
        name: 'type',
        title: 'Media Type',
        type: 'string',
        options: {
          list: [
            {title: 'Image', value: MEDIA_TYPES.IMAGE},
            {title: 'Video', value: MEDIA_TYPES.VIDEO},
          ],
        },
      }),
      defineField({
        name: 'image',
        title: 'Image',
        type: 'image',
        options: {hotspot: true},
        fields: [defineField({name: 'alt', title: 'Alternative text', type: 'string'})],
        hidden: ({parent}) => parent?.type === MEDIA_TYPES.VIDEO || !parent?.type,
      }),
      defineField({
        name: 'provider',
        title: 'Provider',
        type: 'string',
        options: {list: videoProviders},
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
        options: {accept: 'video/mp4,video/x-m4v,video/*'},
        hidden: ({parent}) =>
          parent?.type === MEDIA_TYPES.IMAGE ||
          !parent?.type ||
          !['vimeo', 'youtube'].includes(parent?.provider),
      }),
    ],
    ...params,
  }
}

export default defineType(builder({name: 'media', title: 'Media'}))
