import {BookIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import artistType from './artist'
import author from './author'

export default defineType({
  name: 'book',
  title: 'Books',
  icon: BookIcon,
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
      name: 'tagline',
      title: 'Tagline',
      type: 'array',
      of: [
        {
            type: 'block',
            styles: [
              {title: 'Normal', value: 'normal'},
            ],
            lists: [],
            marks: {
              decorators: [
                {title: 'Strong', value: 'strong'},
                {title: 'Emphasis', value: 'em'},
                {title: 'Underline', value: 'underline'},
              ],
            },

          },
      ],
    }),
    defineField({
      name: 'publisher',
      title: 'Publisher',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'isbn',
      title: 'ISBN',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Publish Date',
      name: 'dateSelection',
      type: 'date',
      description: 'The date the book was published. If the publish date is only a year, select any date in that year. If the book is not yet published, please select the date it will be published.',
    }),
    defineField({
        title: 'Books URL',
        name: 'booksUrl',
        type: 'url',
        description: 'The URL to the book on www.davidzwirnerbooks.com',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
            type: 'block',
            styles: [
              {title: 'Normal', value: 'normal'},
            ],
            marks: {
              decorators: [
                {title: 'Strong', value: 'strong'},
                {title: 'Emphasis', value: 'em'},
                {title: 'Underline', value: 'underline'},
              ],
            },

          },
          {type: 'image'},
      ],
    }),
    defineField({
      name: 'artists',
      title: 'Artists',
      type: 'array',
      of: [
        {
          type: 'reference',
          title: 'Artist',
          to: [{type: artistType.name}],
        },
      ],
    }),
    defineField({
      name: 'authors',
      title: 'Authors',
      type: 'array',
      of: [
        {
          type: 'reference',
          title: 'Authors',
          to: [{type: author.name}],
        },
      ],
    }),
    defineField({
      title: 'Images',
      name: 'photos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            },
          ],
        },
      ],
    })
  ],
  preview: {
    select: {
      title: 'title',
      images: 'photos',
    },
    prepare({title, images}) {
      return {title, media: images?.[0] ?? BookIcon}
    },
  },
})
