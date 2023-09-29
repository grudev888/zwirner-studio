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
import {builder as slugURLBuilder} from '../../objects/utils/slugUrl'
import {builder as PageBuilder, PageBuilderComponents} from '../../objects/utils/pageBuilder'
import {GridComponents} from '../../objects/page/grid'
import blockContentSimple from '../../objects/utils/blockContentSimple'
import { franchiseBrandingField } from '../../objects/data/franchiseBranding'

import artistType from '../artist'
import artwork from '../artwork'
import location from '../location'
import book from '../book'
import artist from '../artist'
import podcast from '../podcast'

import * as Media from '../../objects/utils/media'
import * as DzEditorial from '../../objects/page/components/molecules/dzEditorial'

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
  fields: [
    defineField({
      name: 'hideToggle',
      title: 'Hide',
      type: 'boolean',
      group: 'onlineExhibitionContent',
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
    defineField(
      slugURLBuilder(
        {
          name: 'slug',
          title: 'Slug',
          options: {
            source: (object: any) => {
              const defaultSlug = object?.title ?? ''
              if (!defaultSlug) throw new Error('Please add a title to create a unique slug.')
              return defaultSlug.slice(0, 95)
            },
          },
          group: 'onlineExhibitionContent',
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
            dzCard: [
              artwork,
              book,
              location,
              artist,
              podcast,
              {name: 'article', title: 'Article'} as SchemaTypeDefinition,
              {name: 'exhibitionPage', title: 'Exhibition'} as SchemaTypeDefinition,
            ],
            dzInterstitial: [
              artwork,
              book,
              artist,
              {name: 'exhibitionPage', title: 'Exhibition'} as SchemaTypeDefinition,
            ],
            dzSplit: [{name: 'exhibitionPage', title: 'Exhibition'} as SchemaTypeDefinition],
            grid: {
              references: {
                dzCard: [
                  artwork,
                  book,
                  location,
                  artist,
                  podcast,
                  {name: 'article', title: 'Article'} as SchemaTypeDefinition,
                  {name: 'exhibitionPage', title: 'Exhibition'} as SchemaTypeDefinition,
                ],
              },
              components: [GridComponents.dzCard, GridComponents.dzMedia],
            },
            dzCarousel: {
              references: {
                dzCard: [
                  artwork,
                  book,
                  location,
                  artist,
                  podcast,
                  {name: 'article', title: 'Article'} as SchemaTypeDefinition,
                  {name: 'exhibitionPage', title: 'Exhibition'} as SchemaTypeDefinition,
                ],
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
