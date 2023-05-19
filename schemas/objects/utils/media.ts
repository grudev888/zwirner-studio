import {defineField} from 'sanity'

export const MEDIA_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
}

export default defineField({
  name: 'media',
  title: 'Media',
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
      fields: [defineField({name: 'alt', title: 'Alternative text', type: 'string'})],
      hidden: ({parent}) => {
        return parent?.type === MEDIA_TYPES.VIDEO || !parent?.type
      },
    }),
    defineField({
      name: 'provider',
      title: 'Provider',
      type: 'string',
      options: {list: ['vimeo', 'youtube', 'custom']},
      hidden: ({parent}) => {
        return parent?.type === MEDIA_TYPES.IMAGE || !parent?.type
      },
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'file',
      options: {accept: 'video/mp4,video/x-m4v,video/*'},
      hidden: ({parent}) => {
        return parent?.type === MEDIA_TYPES.IMAGE || !parent?.type || parent?.provider !== 'custom'
      },
    }),
    defineField({
      name: 'externalVideo',
      title: 'Video URL',
      type: 'url',
      options: {accept: 'video/mp4,video/x-m4v,video/*'},
      hidden: ({parent}) => {
        return (
          parent?.type === MEDIA_TYPES.IMAGE ||
          !parent?.type ||
          !['vimeo', 'youtube'].includes(parent?.provider)
        )
      },
    }),
  ],
})
