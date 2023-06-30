import {defineArrayMember, defineField, defineType} from 'sanity'

import slugUrl from '../objects/utils/slugUrl'
import dateSelection from '../objects/utils/dateSelection'
import {randomIntString} from '../../lib/util/strings'
import {ThLargeIcon,ComposeIcon, SearchIcon} from '@sanity/icons'
import artistType from './artist'

// Check If we will need prefilled fields
export default defineType({
  name: 'artwork',
  title: 'Artworks',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
  ],
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'artists',
      title: 'Artists',
      group: 'content',
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
      group: 'content',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'displayTitle',
      title: 'Title Display Options',
      group: 'content',
      type: 'array',
      of: [{type: 'string', }],
      options: {
        list: [
          {title: 'Bold', value: 'strong'},
          {title: 'No Emphasis', value: 'noEmphasis'},
        ]
      }
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slugUrl',
      group: 'content',
      options: {
        ...slugUrl.options,
        source: (object: any) => {
          const defaultSlug = `${object?.title}-${object.dateSelection.year}-${randomIntString(5)}` ?? ''
          if (!defaultSlug) throw new Error('Please add a title to create a unique slug.')
          return defaultSlug.slice(0, 95)
        },
        
      }
    }),
    defineField({
      title: 'Date',
      name: 'dateSelection',
      group: 'content',
      type: dateSelection.name,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'artworksEdition',
      title: 'Artworks Edition',
      group: 'content',
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
      group: 'content',
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
      group: 'content',
      type: 'string',
      options: {
        list: [
          {title: 'Drawing', value: 'drawing'},
          {title: 'Painting', value: 'painting'},
          {title: 'Photography', value: 'photography'},
          {title: 'Sculpture', value: 'sculpture'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'medium',
      title: 'Medium',
      group: 'content',
      type: 'string',
    }),
    defineField({
      name: 'edition',
      title: 'Edition',
      group: 'content',
      type: 'string',
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      group: 'content',
      type: 'text',
    }),
    defineField({
      name: 'framed',
      title: 'Framed',
      group: 'content',
      type: 'boolean',
    }),
    defineField({
      name: 'availability',
      title: 'Availability',
      group: 'content',
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
      group: 'content',
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
