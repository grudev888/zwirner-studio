import {defineArrayMember, defineField, defineType} from 'sanity'

import * as Media from '../objects/utils/media'
import {builder as slugBuilder} from '../objects/utils/slugUrl'
import dateSelection from '../objects/utils/dateSelection'
import {randomIntString} from '../../lib/util/strings'
import {ThLargeIcon, ComposeIcon, SearchIcon, ImageIcon, DocumentVideoIcon} from '@sanity/icons'
import artist from './artist'
import blockContentSimple from '../../schemas/objects/utils/blockContentSimple'

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
      description:
        'The title of the artwork. This will present the standard italicized artwork title and for generating the URL.',
      validation: (Rule) => [
        Rule.required(),
        Rule.max(300).warning(
          'The title is longer than our standard character count, an ellipsis will appear on tile view.'
        ),
      ],
    }),
    defineField({
      name: 'displayCustomTitle',
      title: 'Custom Title Display',
      description:
        'Enable custom display of the artwork title. Leave off to display title in default italicized format.',
      type: 'boolean',
      group: 'content',
    }),
    defineField({
      name: 'displayTitle',
      title: 'Optional Title Display',
      description:
        'For use only in cases where the artist requests custom display decoration for the artwork title, mixing plain, italics, and bold text in the title.',
      group: 'content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [],
          lists: [],
          marks: {
            decorators: [
              {title: 'Emphasis', value: 'em'},
              {title: 'Strong', value: 'strong'},
            ],
            annotations: [],
          },
        },
      ],
      hidden: ({parent}) => !parent?.displayCustomTitle,
    }),
    // should be in format of /artist/[artist-slug]/[artwork-slug]
    // artwork-slug should be title + year + random 5 digit number
    defineField(
      slugBuilder(
        {
          name: 'slug',
          title: 'Slug',
          group: 'content',
          description:
            'Should be in format of /artist/[artist-slug]/[artwork-slug], artwork-slug should be title + year + random 5 digit number. If no artist or year is specified, the slug will be generated from the title and a random 5 digit number.',
          options: {
            source: (object: any) => {
              const defaultSlug =
                `${object?.title}-${object.dateSelection.year}-${randomIntString(5)}` ?? ''
              if (!defaultSlug) throw new Error('Please add a title to create a unique slug.')
              return defaultSlug.slice(0, 95)
            },
          },
        },
        {
          optional: true,
          prefix: async (parent, client) => {
            const artistId = parent.artists[0]?._ref
            const artistPageSlug = await client.fetch(
              `*[_type == "artistPage" && artist._ref == "${artistId}"].slug.current`
            )
            return artistPageSlug
          },
        }
      )
    ),
    defineField({
      name: 'artists',
      title: 'Artists',
      group: 'content',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          title: 'Artist',
          to: [{type: artist.name}],
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
      title: 'Artwork Media',
      name: 'photos',
      group: 'content',
      type: 'array',
      of: [
        {
          type: 'image',
          title: 'Legacy Image',
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
        defineArrayMember(
          Media.builder(
            {
              name: 'artImage',
              icon: ImageIcon,
              title: 'Image',
              preview: {
                select: {
                  image: 'image',
                },
                prepare({image}: any) {
                  const {alt, caption} = image
                  return {title: alt ?? caption, media: image}
                },
              },
            },
            {
              type: Media.MediaTypes.IMAGE,
              image: {
                additionalFields: [
                  defineField({
                    type: 'string',
                    name: 'caption',
                    title: 'Caption',
                  }),
                ],
              },
            }
          )
        ),
        defineArrayMember(
          Media.builder(
            {
              name: 'artVideo',
              icon: DocumentVideoIcon,
              title: 'Video',
            },
            {
              type: Media.MediaTypes.VIDEO,
            }
          )
        ),
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
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'framedDimensions',
      title: 'Framed Dimensions',
      group: 'content',
      type: 'string',
      hidden: ({parent}) => parent?.artworkType === 'sculpture',
    }),
    defineField({
      name: 'framed',
      title: 'Framing',
      group: 'content',
      type: 'string',
      options: {
        list: [
          {title: 'Framed', value: 'Framed'},
          {title: 'Unframed', value: 'Unframed'},
        ],
      },
      hidden: ({parent}) => parent?.artworkType === 'sculpture',
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
            list: [
              {title: 'None', value: 'none'},
              {title: 'Inquire', value: 'inquire'},
              {title: 'E-Comm', value: 'ecomm'},
              {title: 'Custom', value: 'custom'},
            ],
          },
        }),
        defineField({
          name: 'CTAText',
          title: 'CTA Text',
          type: 'string',
          validation: (Rule) => Rule.max(20),
          hidden: ({parent}) => parent?.CTA === 'none' || parent?.CTA === undefined,
        }),
        defineField({
          name: 'CTALink',
          title: 'CTA Link',
          type: 'url',
          hidden: ({parent}) => parent?.CTA !== 'custom',
          validation: (Rule) =>
            Rule.uri({
              allowRelative: true,
            }),
        }),
        defineField({
          name: 'secondaryCTA',
          title: 'Secondary CTA',
          type: 'string',
          initialValue: 'none',
          options: {
            list: [
              {title: 'None', value: 'none'},
              {title: 'Inquire', value: 'inquire'},
              {title: 'Custom', value: 'custom'},
            ],
          },
          hidden: ({parent}) => parent?.CTA === 'none' || parent?.CTA === undefined,
        }),
        defineField({
          name: 'SecondaryCTAText',
          title: 'Secondary CTA Text',
          type: 'string',
          validation: (Rule) => Rule.max(20),
          hidden: ({parent}) =>
            parent?.secondaryCTA === 'none' || parent?.secondaryCTA === undefined,
        }),
        defineField({
          name: 'SecondaryCTALink',
          title: 'Secondary CTA Link',
          type: 'url',
          hidden: ({parent}) => parent?.secondaryCTA !== 'custom',
          validation: (Rule) =>
            Rule.uri({
              allowRelative: true,
            }),
        }),
      ],
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
        list: [
          {title: 'USD', value: 'USD'},
          {title: 'EUR', value: 'EUR'},
          {title: 'GBP', value: 'GBP'},
          {title: 'HKD', value: 'HKD'},
        ],
      },
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
      return {title, media: images?.[0] ?? ImageIcon}
    },
  },
})
