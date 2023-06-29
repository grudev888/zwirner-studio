import {ThLargeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import drawing from '../objects/artTypes/drawing'
import painting from '../objects/artTypes/painting'
import photography from '../objects/artTypes/photography'
import sculpture from '../objects/artTypes/sculpture'
import dateSelection from '../objects/utils/dateSelection'
import artistType from './artist'

// Check If we will need prefilled fields
export default defineType({
  name: 'artwork',
  title: 'Artworks',
  type: 'document',
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: 'artists',
      title: 'Artists',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          title: 'Artist',
          to: [{type: artistType.name}],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      title: 'Date',
      name: 'dateSelection',
      type: dateSelection.name,
    }),
    defineField({
      name: 'artworksEdition',
      title: 'Artworks Edition',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          title: 'Artwork',
          to: [{type: 'artwork'}],
        }),
      ],
    }),
    defineField({
      title: 'Artwork photos',
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
            {
              name: 'url',
              type: 'string',
              title: 'Url redirect',
            },
          ],
        },
      ],
    }),
    defineField({
      title: 'Artworks Type',
      name: 'artworkType',
      type: 'string',
      options: {
        list: [
          {title: 'Drawing', value: 'drawing'},
          {title: 'Painting', value: 'painting'},
          {title: 'Photography', value: 'photography'},
          {title: 'Sculpture', value: 'sculpture'},
        ],
      },
    }),
    defineField({
      name: 'medium',
      title: 'Medium',
      type: 'string',
    }),
    defineField({
      name: 'edition',
      title: 'Edition',
      type: 'string',
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      type: 'text',
    }),
    defineField({
      name: 'framed',
      title: 'Framed',
      type: 'boolean',
    }),
    defineField({
      name: 'availability',
      title: 'Availability',
      type: 'string',
      options: {
        list: [
          {title: 'Available', value: 'available'},
          {title: 'Unavailable', value: 'unavailable'},
        ],
      },
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (rule) => rule.positive().greaterThan(0),
      readOnly: ({currentUser}) => {
        return !currentUser?.roles.find(({name}) => name !== 'administrator')
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      images: 'photos',
    },
    prepare({title, images}) {
      return {title, media: images?.[0] ?? ThLargeIcon}
    },
  },
})
