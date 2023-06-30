import {defineArrayMember, defineField, defineType} from 'sanity'

import slugUrl from '../objects/utils/slugUrl'
import dateSelection from '../objects/utils/dateSelection'
import {randomIntString} from '../../lib/util/strings'
import {ThLargeIcon,ComposeIcon, SearchIcon} from '@sanity/icons'
import artistType from './artist'
import blockContentSimple from '../../schemas/objects/utils/blockContentSimple'

const CTAOptionsList = [
  {title: 'None', value: 'none'},
  {title: 'Inquire', value: 'inquire'},
  {title: 'E-Comm', value: 'e-comm'},
  {title: 'Custom', value: 'custom'},
]

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
      name: 'title',
      title: 'Title',
      group: 'content',
      type: 'string',
      validation: Rule => [
        Rule.required(),
        Rule.max(300).warning('The title is longer than our standard character count, an ellipsis will appear on tile view.')
      ]
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
      title: 'Artwork Media',
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
    defineField({
      name: 'currency',
      title: 'Currency',
      group: 'content',
      type: 'string',
      options: {
        list: ['USD', 'EUR', 'GBP', 'HKD']
      }
    }),
    defineField({
      name: 'artworkCTA',
      title: 'Artwork CTA',
      group: 'content',
      type: 'object',
      fields: [
        defineField({
          name: 'CTA',
          title: 'CTA',
          type: 'string',
          initialValue: 'none',
          options: {
            list: CTAOptionsList,
          },
        }),
        defineField({
          name: 'CTAText',
          title: 'CTA Text',
          type: 'string',
          hidden: ({ parent }) => parent?.CTA === 'none'
        }),
        defineField({
          name: 'CTALink',
          title: 'CTA Link',
          type: 'url',
          hidden: ({ parent }) => parent?.CTA !== 'custom'
        }),
        defineField({
          name: 'secondaryCTA',
          title: 'Secondary CTA',
          type: 'string',
          initialValue: 'none',
          options: {
            list: CTAOptionsList,
          },
        }),
        defineField({
          name: 'SecondaryCTAText',
          title: 'Secondary CTA Text',
          type: 'string',
          hidden: ({ parent }) => parent?.secondaryCTA === 'none'
        }),
        defineField({
          name: 'SecondaryCTALink',
          title: 'Secondary CTA Link',
          type: 'url',
          hidden: ({ parent }) => parent?.secondaryCTA !== 'custom'
        }),
      ],
    }),
    defineField({
      name: 'additionalCaption',
      title: 'Additional Caption',
      group: 'content',
      type: 'array',
      of: blockContentSimple,
    }),
    defineField({
      name: 'editionInformation',
      title: 'Edition Information',
      group: 'content',
      type: 'array',
      of: blockContentSimple,
    }),
    defineField({
      name: 'copyrightInformation',
      title: 'Copyright Information',
      group: 'content',
      type: 'array',
      of: blockContentSimple,
    }),
    defineField({
      name: 'salesInformation',
      title: 'Sales Information',
      group: 'content',
      type: 'array',
      of: blockContentSimple,
    }),
    defineField({
      name: 'productInformation',
      title: 'Product Information',
      group: 'content',
      type: 'array',
      of: blockContentSimple,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      group: 'content',
      type: 'array',
      of: blockContentSimple,
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
