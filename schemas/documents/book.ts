import {BookIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import blockContentSimple from '../../schemas/objects/utils/blockContentSimple'

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
      name: 'tagline',
      title: 'Tagline',
      description: 'The tagline that will appear on the book page. Will display in books cards',
      validation: (rule) => rule.required(),
      type: 'array',
      of: blockContentSimple,
    }),
    defineField({
      name: 'publisher',
      title: 'Publisher',
      type: 'string',
      description: 'The publisher of the book. Will display in books cards',
      validation: (rule) => rule.required(),
    }),
    defineField({
        title: 'Books URL',
        name: 'booksUrl',
        type: 'url',
        validation: (rule) => rule.required(),
        description: 'The URL to the book on www.davidzwirnerbooks.com',
    }),
    defineField({
      title: 'Images',
      name: 'photos',
      type: 'array',
      description: 'The images that will appear on the book page. The first image will be used on cards.',
      validation: (rule) => rule.required(),
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
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Future Use: Optional subtitle for the book.',
    }),
    defineField({
      name: 'isbn',
      title: 'ISBN',
      type: 'string',
      description: 'Future use',
    }),
    defineField({
      title: 'Publish Date',
      name: 'dateSelection',
      type: 'date',
      description: 'Future use: The date the book was published. If the publish date is only a year, select any date in that year. If the book is not yet published, please select the date it will be published.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      description: 'Future use: This is the description that will appear on the book page. It is not currently being used.',
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
      description: 'Future use: This is the list of artists that will appear on the book page. It is not currently being used.',
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
      description: 'Future use: This is the list of authors that will appear on the book page. It is not currently being used.',
      of: [
        {
          type: 'reference',
          title: 'Authors',
          to: [{type: author.name}],
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
