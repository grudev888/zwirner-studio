import {BlockElementIcon, ComposeIcon, SearchIcon} from '@sanity/icons'
import {defineArrayMember,defineField, defineType} from 'sanity'

// import {apiVersion} from '../../../env'
// import {exhibitionById} from '../../../queries/exhibition.queries'
import exhibition from '../../../schemas/documents/exhibition'
import {builder as slugURLBuilder} from '../../objects/utils/slugUrl'
import artistType from '../artist'
import artworkType from '../artwork'
import collectionType from '../collection'
import eventType from '../event'

export default defineType({
  name: 'exhibitionPage',
  title: 'Exhibition Page',
  type: 'document',
  icon: BlockElementIcon,
  preview: {
    select: {title: 'title', photos: 'exhibition.photos'},
    prepare: ({title, photos}) => ({title, media: photos?.[0]}),
  },
  groups: [
    {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
  ],
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
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField(
      slugURLBuilder(
        {
          name: 'slug',
          title: 'Slug',
          options: {
            source: (object: any) => {
              // const exhibitionRef = object?.exhibition?._ref
              const defaultSlug = object?.title ?? ''

              if (!defaultSlug)
                throw new Error('Please add a title to create a unique slug.')
                return defaultSlug.slice(0, 95)

              // if (!exhibitionRef) return defaultSlug

              // const {getClient} = context
              // const client = getClient({apiVersion})
              // // const params = {exhibitionId: exhibitionRef}
              // return client.fetch(exhibitionById, params).then((result: any) => {
              //   const [exhibition] = result ?? []
              //   return exhibition?.title ?? defaultSlug
              // })
            },
          },
          group: 'content',
        },
        {
          prefix: async (parent) => {
            // const exhibitionId = parent.exhibition?._ref
            // const exhibition = await client.fetch(`*[_id == $exhibitionId][0]`, {exhibitionId})
            const dateFormatter = new Intl.DateTimeFormat('en-US', {
              timeZone: 'UTC',
              year: 'numeric',
            })
            const year = dateFormatter.format(new Date(parent.endDate))
            return `/exhibitions/${year}`
          },
        }
      )
    ),
    defineField({
      name: 'artists',
      title: 'Artists',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: artistType.name}],
        }),
      ],
    }),
    
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      group: 'content',
      type: 'string',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      group: 'content',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      group: 'content',
      type: 'text',
    }),
    defineField({
      type: 'string',
      name: 'displayDate',
      title: 'Display Date',
      group: 'content',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      group: 'content',
      type: 'date',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      group: 'content',
      type: 'date',
      validation: (Rule) =>
        Rule.required()
          .min(Rule.valueOfField('startDate'))
          .error('The end date should be greater than the start date'),
    }),
    defineField({
      name: 'photos',
      title: 'Exhibition photos',
      group: 'content',
      type: 'array',
      of: [
        defineArrayMember({
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
        }),
      ],
    }),
    // removed to deprecate events
    // defineField({
    //   name: 'events',
    //   title: 'Events',
    //   group: 'content',
    //   type: 'array',
    //   of: [
    //     defineArrayMember({
    //       type: 'reference',
    //       to: [{type: eventType.name}],
    //     }),
    //   ],
    // }),
    defineField({
      name: 'locations',
      title: 'Locations',
      group: 'content',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'location'}],
        }),
      ],
    }),
    defineField({
      name: 'artworks',
      title: 'Artworks',
      group: 'content',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: artworkType.name}],
        }),
      ],
    }),
    defineField({
      name: 'collections',
      title: 'Collections',
      group: 'content',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: collectionType.name}],
        }),
      ],
    }),
    defineField({
      name: 'exhibition',
      title: 'Exhibition',
      type: 'reference',
      group: 'content',
      description: 'THIS IS DEPRECATED. DO NOT POPULATE',
      to: [{type: exhibition.name}],
    }),
    defineField({
      name: 'components',
      title: 'Components',
      type: 'pageBuilderComponents',
      group: 'content',
    }),
  ],
})
