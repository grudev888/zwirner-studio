import {BlockElementIcon, ComposeIcon, SearchIcon, DocumentIcon} from '@sanity/icons'
import * as Interstitial from '../../objects/page/components/primitives/interstitial'
import {
  ObjectRule,
  defineArrayMember,
  defineField,
  defineType,
  SchemaTypeDefinition,
  StringRule,
} from 'sanity'
import {slugify} from '../../../lib/util/strings'
import {SLUG_MAX_LENGTH, builder as slugURLBuilder} from '../../objects/utils/slugUrl'
import {builder as PageBuilder, PageBuilderComponents} from '../../objects/utils/pageBuilder'
import {GridComponents} from '../../objects/page/grid'
import blockContentSimple from '../../objects/utils/blockContentSimple'
import {franchiseBrandingField} from '../../objects/data/franchiseBranding'

import artistType from '../artist'
import artwork from '../artwork'
import book from '../book'
import podcast from '../podcast'

import * as Media from '../../objects/utils/media'
import * as DzEditorial from '../../objects/page/components/molecules/dzEditorial'

const EXHIBITIONS_PREFIX = '/exhibitions/year/'
const SLUG_BODY_LENGTH = SLUG_MAX_LENGTH - EXHIBITIONS_PREFIX.length

export default defineType({
  name: 'onlineExhibitionPage',
  title: 'Online Exhibition',
  type: 'document',
  icon: BlockElementIcon,
  groups: [
    {name: 'onlineExhibitionContent', title: 'Online Exhibition', icon: ComposeIcon, default: true},
    {name: 'content', title: 'Content', icon: DocumentIcon},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
  ],
  preview: {
    select: {title: 'title', heroMedia: 'heroMedia', cardMedia: 'cardViewMedia'},
    prepare: ({title, heroMedia, cardMedia}) => ({
      title,
      media: cardMedia?.image ?? heroMedia?.image,
    }),
  },
  fields: [
    defineField({
      name: 'hideToggle',
      title: 'Private',
      type: 'boolean',
      group: 'onlineExhibitionContent',
      initialValue: false,
      description: 'Hide this page from Exhibitions, Past and Current.',
    }),
    defineField({
      name: 'title',
      title: 'Primary Title',
      type: 'string',
      description:
        'It will be combined with Primary Subtitle to display the full title: [Primary Title]: [Primary Subtitle]. If no subtitle is added then only Primary Title should be displayed. On cards, it is displayed as Primary Title.',
      group: 'onlineExhibitionContent',
      validation: (rule: StringRule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Primary Subtitle',
      type: 'string',
      description:
        'It will be combined with Primary Title to display the full title: [Primary Title]: [Primary Subtitle]. On cards, it is displayed as Primary Subtitle.',
      group: 'onlineExhibitionContent',
    }),
    defineField({
      name: 'summary',
      title: 'Description',
      group: 'onlineExhibitionContent',
      description:
        'This is used to describe the exhibition and appears as the text in exhibition cards.',
      type: 'array',
      of: blockContentSimple,
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      group: 'onlineExhibitionContent',
      description:
        'It will appear as small text on cards above the title. Max 100 characters. When the field is left blank, the page type will be displayed.',
      type: 'string',
      validation: (rule) => rule.max(100),
    }),
    defineField(franchiseBrandingField({group: 'onlineExhibitionContent'})),
    defineField({
      name: 'status',
      title: 'Status',
      group: 'onlineExhibitionContent',
      type: 'string',
      description:
        'This will override the date-based dynamic status text of the exhibition. This text will automatically will change to Coming Soon, Open, or Closed unless if this field is left blank.',
      validation: (rule) => rule.max(50),
      options: {
        list: [
          {title: 'Coming Soon', value: 'comingSoon'},
          {title: 'Open', value: 'open'},
          {title: 'Close', value: 'close'},
        ],
      },
    }),
    defineField({
      name: 'displayDate',
      title: 'Display Date',
      description:
        'This field will override the default display dates used by start and end dates below.',
      group: 'onlineExhibitionContent',
      type: 'string',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      group: 'onlineExhibitionContent',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      group: 'onlineExhibitionContent',
      type: 'date',
      validation: (rule: any) =>
        rule
          .required()
          .min(rule.valueOfField('startDate'))
          .error('The end date should be greater than the start date'),
    }),
    defineField({
      name: 'artists',
      title: 'Artists',
      type: 'array',
      group: 'onlineExhibitionContent',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: artistType.name}],
        }),
      ],
    }),
    defineField(
      Media.builder(
        {
          name: 'cardViewMedia',
          title: 'Card View Media',
          group: 'content',
          description:
            'It appears on a card throughout the site, if this field is empty, cards should display the Hero media',
        },
        {type: Media.MediaTypes.IMAGE},
      ),
    ),
    defineField(
      Media.builder({
        name: 'heroMedia',
        title: 'Hero Media',
        group: 'onlineExhibitionContent',
        description: 'Media module',
        validation: (rule: ObjectRule) => rule.required(),
      }),
    ),
    defineField(
      DzEditorial.builder(
        {
          name: 'ovrIntro',
          title: 'OVR Intro',
          group: 'onlineExhibitionContent',
          description: 'Editorial Module',
        },
        {references: [], hideComponentTitle: true},
      ),
    ),
    defineField(
      Interstitial.builder({
        name: 'interstitial',
        group: 'onlineExhibitionContent',
        title: 'Interstitial',
        options: {collapsible: true, collapsed: true},
      }),
    ),
    defineField(
      slugURLBuilder(
        {
          name: 'slug',
          title: 'Slug',
          options: {
            source: (object: any) => {
              const defaultSlug = object?.subtitle
                ? `${object?.title}-${object?.subtitle}`
                : object?.title
              if (!defaultSlug) throw new Error('Please add a title to create a unique slug.')
              return defaultSlug.slice(0, SLUG_BODY_LENGTH)
            },
          },
          group: 'onlineExhibitionContent',
          validation: (Rule) => [
            Rule.custom((slug, parent) => {
              const {title} = parent.parent
              const titleSlug = slugify(title)
              if (!slug.current.includes(titleSlug)) {
                return `Slug should include the title: ${titleSlug}`
              }
              return true
            }).warning(),
            Rule.custom((slug) => {
              if (slug.current.length > SLUG_MAX_LENGTH) {
                return `Slug should be  more than ${SLUG_BODY_LENGTH} characters. `
              }
              return true
            }).warning(),
          ],
        },
        {
          prefix: async (parent) => {
            const dateFormatter = new Intl.DateTimeFormat('en-US', {
              timeZone: 'America/New_York',
              year: 'numeric',
            })
            const year = dateFormatter.format(new Date(parent.startDate))
            return `/exhibitions/${year}`
          },
        },
      ),
    ),

    // CONTENT

    defineField(
      PageBuilder(
        {
          name: 'onlineExhibitionContent',
          title: 'Content',
          group: 'content',
        },
        {
          components: [
            PageBuilderComponents.dzInterstitial,
            PageBuilderComponents.dzSplit,
            PageBuilderComponents.dzCard,
            PageBuilderComponents.dzMedia,
            PageBuilderComponents.dzEditorial,
            PageBuilderComponents.dzGrid,
            PageBuilderComponents.dzCarousel,
          ],
          references: {
            oneUp: [artwork, book, podcast],
            dzSplit: [{name: 'exhibitionPage', title: 'Exhibition'} as SchemaTypeDefinition],
            grid: {
              references: {
                dzCard: [artwork, book],
              },
              components: [GridComponents.dzCard, GridComponents.dzMedia],
            },
            dzCarousel: {
              references: {
                dzCard: [artwork, book],
              },
              components: [GridComponents.dzCard, GridComponents.dzMedia],
            },
          },
        },
      ),
    ),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
})
