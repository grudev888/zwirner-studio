import {NumberRule, SlugRule, defineArrayMember, defineField, defineType} from 'sanity'
import groq from 'groq'

import * as Media from '../objects/utils/media'
import {SLUG_MAX_LENGTH, builder as slugBuilder} from '../objects/utils/slugUrl'
import {ThLargeIcon, ComposeIcon, SearchIcon, ImageIcon, DocumentVideoIcon} from '@sanity/icons'
import artist from './artist'
import blockContentSimple from '../../schemas/objects/utils/blockContentSimple'
import blockContentSimpleWithLinks from '../objects/utils/blockContentSimpleWithLinks'
import dateSelectionYear from '../objects/utils/dateSelectionYear'

import ShopifyIcon from '../../components/icons/Shopify'

import {apiVersion} from '../../env'
import {slugify} from '../../lib/util/strings'

const ARTWORKS_PREFIX = '/artworks/'
const HASH_LENGTH = 5
const ARTWORK_SUFFIX_LENGTH = HASH_LENGTH + 1 // 1 for the dash
const SLUG_BODY_LENGTH = SLUG_MAX_LENGTH - ARTWORKS_PREFIX.length - ARTWORK_SUFFIX_LENGTH

// Check If we will need prefilled fields
export default defineType({
  name: 'artwork',
  title: 'Artworks',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
    {name: 'shopify', title: 'Shopify', icon: ShopifyIcon},
  ],
  icon: ThLargeIcon,
  fields: [
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
          'The title is longer than our standard character count, an ellipsis will appear on tile view.',
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
      name: 'displayDate',
      title: 'Display Date',
      description:
        'This field will override the default display dates used by the date selector below.',
      group: 'content',
      type: 'string',
    }),
    defineField({
      title: 'Date',
      name: 'dateSelection',
      group: 'content',
      type: dateSelectionYear.name,
      validation: (rule) =>
        rule.custom((value) => {
          const {year} = value as {year: string}
          if (!year) {
            return 'Required'
          }
          return true
        }),
    }),
    defineField({
      title: 'Artwork Media',
      name: 'photos',
      group: 'content',
      type: 'array',
      validation: (rule) => rule.required(),
      of: [
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
            },
          ),
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
            },
          ),
        ),
        defineArrayMember(
          Media.builder(
            {
              name: 'artVideoRecord',
              icon: DocumentVideoIcon,
              title: 'Video Record',
            },
            {
              type: Media.MediaTypes.VIDEO_RECORD,
            },
          ),
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
          {title: 'Mixed Media', value: 'mixedMedia'},
          {title: 'Painting', value: 'painting'},
          {title: 'Photography', value: 'photography'},
          {title: 'Print', value: 'print'},
          {title: 'Sculpture', value: 'sculpture'},
          {title: 'Other', value: 'other'},
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
      name: 'inventoryId',
      title: 'Inventory ID',
      group: 'content',
      type: 'string',
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      group: 'content',
      type: 'array',
      of: blockContentSimple,
    }),
    defineField({
      name: 'framedDimensions',
      title: 'Framed Dimensions',
      group: 'content',
      type: 'array',
      of: blockContentSimple,
      hidden: ({parent}) => parent?.artworkType === 'sculpture',
    }),
    defineField({
      name: 'framed',
      title: 'Framing',
      group: 'content',
      type: 'string',
      options: {
        list: [
          {title: 'Not Applicable', value: 'NotApplicable'},
          {title: 'Framed', value: 'Framed'},
          {title: 'Unframed', value: 'Unframed'},
          {title: 'Sold Out', value: 'soldout'},
        ],
      },
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {artworkType: string}
          if (!value) return 'Required'

          if (parent.artworkType === 'sculpture' && value !== 'NotApplicable') {
            return "Sculpture must be marked as 'Not Applicable.'"
          }
          return true
        }),
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
              {title: 'Sold Out', value: 'soldout'},
            ],
          },
        }),
        defineField({
          name: 'CTAText',
          title: 'CTA Text',
          type: 'string',
          validation: (Rule) => [
            Rule.max(20),
            Rule.custom((value, context) => {
              const parent = context.parent as {CTA: string}
              if (!value && parent.CTA === 'custom')
                return 'Custom CTA Text is required if CTA is set to Custom'
              return true
            }),
          ],
          hidden: ({parent}) => parent?.CTA === 'none' || parent?.CTA === undefined,
        }),
        defineField({
          name: 'CTALink',
          title: 'CTA Link',
          type: 'url',
          hidden: ({parent}) => parent?.CTA !== 'custom',
          validation: (Rule) => [
            Rule.uri({
              allowRelative: true,
            }),
            Rule.custom((value, context) => {
              const parent = context.parent as {CTA: string}
              if (!value && parent.CTA === 'custom')
                return 'CTA Link is required if CTA is set to Custom'
              return true
            }),
          ],
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
          validation: (Rule) => [
            Rule.max(20),
            Rule.custom((value, context) => {
              const parent = context.parent as {secondaryCTA: string}
              if (!value && parent.secondaryCTA === 'custom')
                return 'Secondary CTA Text is required if secondaryCTA is set to Custom'
              return true
            }),
          ],
          hidden: ({parent}) =>
            parent?.secondaryCTA === 'none' || parent?.secondaryCTA === undefined,
        }),
        defineField({
          name: 'SecondaryCTALink',
          title: 'Secondary CTA Link',
          type: 'url',
          hidden: ({parent}) => parent?.secondaryCTA !== 'custom',
          validation: (Rule) => [
            Rule.uri({
              allowRelative: true,
            }),
            Rule.custom((value, context) => {
              const parent = context.parent as {secondaryCTA: string}
              if (!value && parent.secondaryCTA === 'custom')
                return 'Secondary CTA Link is required if secondaryCTA is set to Custom'
              return true
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      group: 'content',
      type: 'string',
      options: {
        list: [
          {title: 'Transparent', value: 'transparent'},
          {title: 'Light Grey', value: 'lightGrey'},
          {title: 'Dark Grey', value: 'darkGrey'},
        ],
      },
      initialValue: 'lightGrey',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      group: 'content',
      type: 'number',
      validation: (rule: NumberRule) => rule.positive().greaterThan(0),
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
      of: blockContentSimpleWithLinks,
    }),
    defineField({
      name: 'productInformation',
      title: 'Product Information',
      group: 'content',
      type: 'array',
      of: blockContentSimpleWithLinks,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      group: 'content',
      type: 'array',
      of: blockContentSimple,
    }),
    // should be in format of /artworks/[artist-slug]-[artwork-slug]-[hash]
    // artist-slug — artist's full name field, with replaced spaces and special characters with dashes, and converted to lowercase
    // artwork-slug — artwork's title with replaced spaces and special characters with dashes, and converted to lowercase
    // hash — last 5 chars of id (slice(-5))
    defineField(
      slugBuilder(
        {
          name: 'slug',
          title: 'Slug',
          group: 'content',
          description:
            'Should be in format of /artworks/[artist-slug]-[artwork-slug]-[hash]. artist-slug is the full artist name, artwork-slug is the title of the artwork, and hash is a 5 digit semi-random hash generated from the artwork UID.',
          options: {
            source: async (object: any, context: any) => {
              const artistId = object.artists?.[0]?._ref
              const client = context.getClient({apiVersion})
              if (!artistId) throw new Error('Link an artist to generate a slug')
              if (!object.title) throw new Error('Please add a title to create a unique slug.')
              const artistFullName = await client.fetch(
                `*[_type == "artist" && _id == $artistId][0].fullName`,
                {artistId},
              )
              const defaultSlug = `${artistFullName}-${object.title}`
              if (!defaultSlug) throw new Error('Please add a title to create a unique slug.')
              return defaultSlug
            },
          },
          validation: (rule: SlugRule) => [
            rule.custom(async (value, context: any) => {
              const slug = value?.current || ''
              if (slug.length > SLUG_MAX_LENGTH) return 'Slug is too long'
              const artistId = context.parent.artists[0]?._ref
              const client = context.getClient({apiVersion})
              const artistFullName = await client.fetch(
                `*[_type == "artist" && _id == $artistId][0].fullName`,
                {artistId},
              )
              const normalizedFullName = slugify(artistFullName)
              const isSlugValid = slug.includes(normalizedFullName)
              return isSlugValid || 'Author name should be displayed correctly'
            }),
            rule
              .custom(async (value, context: any) => {
                const slug = value?.current || ''
                if (slug.length > SLUG_MAX_LENGTH) return 'Slug is too long'
                const artistId = context.parent.artists[0]?._ref
                const client = context.getClient({apiVersion})
                const artistFullName = await client.fetch(
                  `*[_type == "artist" && _id == $artistId][0].fullName`,
                  {artistId},
                )
                const normalizedTitle = slugify(context.parent.title)
                const normalizedFullName = slugify(artistFullName)
                const MAX_TITLE_LENGTH = SLUG_BODY_LENGTH - normalizedFullName.length - 1 // 1 for the dash
                const expectedTitle = normalizedTitle.slice(0, MAX_TITLE_LENGTH)
                const isSlugValid = slug.includes(expectedTitle)
                return isSlugValid || 'It is recommended to display the title of the artwork.'
              })
              .warning(),
          ],
        },
        {
          prefix: ARTWORKS_PREFIX,
          suffix: async (parent) => {
            const hash = parent._id?.slice(-HASH_LENGTH)
            if (!hash) throw new Error('Artwork ID is missing or invalid')
            return `-${hash}`
          },
        },
      ),
    ),
    defineField({
      name: 'shopify',
      title: 'Shopify',
      type: 'reference',
      to: [{type: 'product'}],
      options: {
        disableNew: true,
        filter: '', // need to filter out any products that have count(*[references(^._id)]) > 0
      },
      group: 'shopify',
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          const parent = context.parent as {artworkCTA: {CTA: string}; _id: string}
          if (parent.artworkCTA?.CTA === 'ecomm') {
            if (!value) return 'Shopify is required if CTA is set to E-Comm'
            const client = context.getClient({apiVersion})
            const artworks = await client.fetch(
              groq`*[_type == "artwork" && shopify._ref == $shopify_ref && _id != $_id && "drafts." + _id != $_id ] {
                ...
              }`,
              {shopify_ref: value._ref, _id: parent._id},
            )
            if (artworks.length)
              return `Shopify product must be unique. (Artwork using this Product: ${artworks[0].title}`
            return true
          }
          return true
        }),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      images: 'photos',
    },
    prepare({title, images}) {
      const newImage = images?.[0]?.image
      return {title, media: newImage ?? images?.[0] ?? ImageIcon}
    },
  },
})
