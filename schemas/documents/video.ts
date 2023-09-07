import {PlayIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import blockContentSimple from '../../schemas/objects/utils/blockContentSimple'

// Regular expressions for Vimeo and YouTube URLs
/* eslint-disable */
const vimeoRegex =
  /(?:https)?:?\/?\/?(?:www\.)?(?:player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/
const youtubeRegex =
  /^(?:https?:)?(?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]{7,15})(?:[\?&][a-zA-Z0-9\_-]+=[a-zA-Z0-9\_-]+)*(?:[&\/\#].*)?$/
/* eslint-enable */

export default defineType({
  name: 'video',
  title: 'Videos',
  icon: PlayIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'desktopProviderURL',
      type: 'url',
      title: 'Desktop Video URL',
      description:
        'URL of a YouTube or Vimeo video. For Vimeo, this should to be in the format https://vimeo.com/[Video ID]. For YouTube, this should be in the format https://www.youtube.com/watch?v=[Video ID]. URL must use https.',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['https'],
          allowRelative: false,
        }).custom((desktopProviderURL) => {
          if (desktopProviderURL && (vimeoRegex.test(desktopProviderURL) || youtubeRegex.test(desktopProviderURL))) {
            return true
          } else {
            return 'Please provide a valid Vimeo or YouTube URL.'
          }
        }),
    }),
    defineField({
      name: 'mobileProviderURL',
      type: 'url',
      title: 'Mobile Video URL',
      description: 'Optional URL of a YouTube or Vimeo video for mobile devices only',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['https'],
          allowRelative: false,
        }).custom((mobileProviderURL) => {
          if (typeof mobileProviderURL === 'undefined') {
            return true
          }
          if (vimeoRegex.test(mobileProviderURL) || youtubeRegex.test(mobileProviderURL)) {
            return true
          } else {
            return 'Please provide a valid Vimeo or YouTube URL.'
          }
        }),
    }),
    defineField({
      name: 'posterImage',
      title: 'Poster Image',
      type: 'image',
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      type: 'date',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: ['PROGRAM', 'Trailer', 'Art+', 'In the Galleries'],
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: blockContentSimple,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      images: 'image',
    },
    prepare({title, images}) {
      return {title, media: images?.[0] ?? PlayIcon}
    },
  },
})
