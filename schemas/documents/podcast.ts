import {ActivityIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import blockContentSimple from '../../schemas/objects/utils/blockContentSimple'

export default defineType({
  name: 'podcast',
  title: 'Podcasts',
  icon: ActivityIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
        title: 'Published Date',
        name: 'dateSelection',
        type: 'date',
      }),
    defineField({
      name: 'comingSoonSwitch',
      title: 'Coming Soon',
      type: 'boolean',
    }),
    defineField({
      name: 'comingSoonText',
      title: 'Coming Soon Text',
      type: 'text',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: blockContentSimple,
    }),
    defineField({
      name: 'itunesUrl',
      title: 'iTunes URL',
      type: 'url',
    }),
    defineField({
      name: 'spotifyUrl',
      title: 'Spotify URL',
      type: 'url',
      }),
    defineField({
      name: 'googlePlayUrl',
      title: 'Google Play URL',
      type: 'url',
    }),
    defineField({
      name: 'stitcherURL',
      title: 'Stitcher URL',
      type: 'url',
    }),
    defineField({
      name: 'iHeartUrl',
      title: 'iHeart Radio URL',
      type: 'url',
    }),
    defineField({
      name: 'mp3Url',
      title: 'MP3 URL',
      type: 'url',
    }),
    defineField({
      name: 'transcript',
      title: 'Transcript',
      type: 'file',
      options: {accept: 'text/plain, application/msword, application/pdf'},
    }),
  ]
})
