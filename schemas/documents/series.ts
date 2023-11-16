import {SlugRule, defineArrayMember, defineField, defineType} from 'sanity'
import {ComponentIcon, ComposeIcon, SearchIcon, BlockElementIcon} from '@sanity/icons'
import * as Media from '../objects/utils/media'
import {slugify} from '../../lib/util/strings'
import {builder as slugBuilder} from '../objects/utils/slugUrl'
import {artistPageWithSurvey} from '../../queries/artist.queries'
import {builder as PageBuilder, PageBuilderComponents} from '../objects/utils/pageBuilder'
import {GridComponents} from '../objects/page/grid'
import artwork from './artwork'
import book from './book'

enum SeriesTypes {
  'Series' = 'series',
  'Collection' = 'collection',
}
export default defineType({
  type: 'document',
  name: 'series',
  title: 'Series',
  icon: ComponentIcon,
  groups: [
    {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
    {name: 'detailPage', title: 'Detail Page', icon: BlockElementIcon},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'slugTitle',
      title: 'Slug Title',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'displayDate',
      title: 'Display Date',
      description:
        'This field will override the default display dates used by start and end dates below.',
      group: 'content',
      type: 'string',
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
      validation: (rule: any) =>
        rule
          .min(rule.valueOfField('startDate'))
          .error('The end date should be greater than the start date'),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      group: 'content',
      options: {
        list: [
          {title: 'Series', value: SeriesTypes.Series},
          {title: 'Collection', value: SeriesTypes.Collection},
        ],
      },
    }),
    defineField(
      Media.builder(
        {
          name: 'image',
          title: 'Series Media',
          group: 'content',
        },
        {
          type: Media.MediaTypes.IMAGE,
        },
      ),
    ),

    defineField({
      name: 'artists',
      title: 'Artists',
      type: 'array',
      group: 'content',
      hidden: ({parent}) => !parent?.type || parent?.type === SeriesTypes.Collection,
      of: [
        defineArrayMember({
          title: 'Artist ',
          type: 'reference',
          to: [{type: 'artist'}],
        }),
      ],
    }),

    defineField({
      name: 'authors',
      title: 'Authors',
      type: 'array',
      group: 'content',
      hidden: ({parent}) => !parent?.type || parent?.type === SeriesTypes.Series,
      of: [
        defineArrayMember({
          title: 'Author',
          type: 'reference',
          to: [{type: 'author'}],
        }),
      ],
    }),

    defineField(
      PageBuilder(
        {
          name: 'detailContent',
          title: 'Detail Page',
          group: 'detailPage',
        },
        {
          components: [
            PageBuilderComponents.dzEditorial,
            PageBuilderComponents.dzGrid,
            PageBuilderComponents.dzInterstitial,
          ],
          references: {
            grid: {
              references: {
                dzCard: [artwork, book],
              },
              components: [GridComponents.dzCard, GridComponents.dzMedia],
            },
          },
        },
      ),
    ),

    defineField(
      slugBuilder(
        {
          name: 'slug',
          title: 'Slug',
          group: 'content',
          options: {
            source: async (object: any) => {
              const defaultSlug = object?.slugTitle ?? ''
              if (!defaultSlug) throw new Error('Please add a slug title to create a unique slug.')
              return defaultSlug
            },
          },
          validation: (Rule: SlugRule) => [
            Rule.custom((slug, parent) => {
              const {slugTitle} = parent.parent as any
              const titleSlug = slugify(slugTitle)
              if (slug && slug.current && !slug.current.includes(titleSlug)) {
                return `Slug should include the title: ${titleSlug}`
              }
              return true
            }).warning(),
          ],
        },
        {
          prefix: async (parent, client) => {
            const seriesId = parent?._id
            const defaultSlug = parent?.slugTitle ?? ''
            if (!defaultSlug) throw new Error('Please add a slug title to create a unique slug.')
            if (!seriesId) return defaultSlug
            const params = {id: seriesId.replace('drafts.', '')}
            const result = await client.fetch(artistPageWithSurvey, params)
            return result?.artistPageSlug ? `${result?.artistPageSlug}/survey/` : ''
          },
        },
      ),
    ),

    defineField({
      type: 'seo',
      name: 'seo',
      title: 'SEO',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      image: 'image',
    },
    prepare: ({title, image}) => {
      return {
        title,
        media: image?.image,
      }
    },
  },
})
