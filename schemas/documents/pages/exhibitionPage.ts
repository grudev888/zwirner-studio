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

import artistType from '../artist'
import artwork from '../artwork'
import location from '../location'
import book from '../book'
import artist from '../artist'
import podcast from '../podcast'
import curator from '../curator'

import * as Media from '../../objects/utils/media'
import * as DzEditorial from '../../objects/page/components/molecules/dzEditorial'
import * as DzGrid from '../../objects/page/grid'

export default defineType({
  name: 'exhibitionPage',
  title: 'Exhibition',
  type: 'document',
  icon: BlockElementIcon,
  preview: {
    select: {title: 'title', heroMedia: 'heroMedia'},
    prepare: ({title, heroMedia}) => ({title, media: heroMedia?.image}),
  },
  groups: [
    {name: 'content', title: 'Exhibition', icon: ComposeIcon, default: true},
    {name: 'pressRelease', title: 'Press Release', icon: DocumentIcon},
    {name: 'explore', title: 'Explore', icon: DocumentIcon},
    {name: 'checklist', title: 'Checklist', icon: DocumentIcon},
    {name: 'installationViews', title: 'Installation Views', icon: DocumentIcon},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Primary Title',
      type: 'string',
      description:
        'It will be combined with Primary Subtitle to display the full title: [Primary Title]: [Primary Subtitle]. If no subtitle is added then only Primary Title should be displayed. On cards, it is displayed as Primary Title.',
      group: 'content',
      validation: (rule: StringRule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Primary Subtitle',
      type: 'string',
      description:
        'It will be combined with Primary Title to display the full title: [Primary Title]: [Primary Subtitle]. On cards, it is displayed as Primary Subtitle.',
      group: 'content',
    }),
    defineField({
      name: 'summary',
      title: 'Description',
      group: 'content',
      description:
        'This is used to describe the exhibition and appears as the text in exhibition cards.',
      type: 'array',
      of: blockContentSimple,
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      group: 'content',
      description:
        'It will appear as small text on cards above the title. Max 100 characters. When the field is left blank, the page type will be displayed.',
      type: 'string',
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      group: 'content',
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
      group: 'content',
      type: 'string',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      group: 'content',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      group: 'content',
      type: 'date',
      validation: (rule: any) =>
        rule
          .required()
          .min(rule.valueOfField('startDate'))
          .error('The end date should be greater than the start date'),
    }),
    defineField({
      name: 'reception',
      title: 'Opening Reception',
      group: 'content',
      type: 'string',
      description: 'Short text describing the opening reception date and time for the exhibition.',
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: 'locations',
      title: 'Locations',
      group: 'content',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: location.name}],
        }),
      ],
    }),
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
      name: 'curator',
      title: 'Curator',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          title: 'Curator',
          type: 'reference',
          to: [{type: curator.name}],
        }),
      ],
    }),
    defineField(
      Media.builder({
        name: 'heroMedia',
        title: 'Hero Media',
        group: 'content',
        description: 'Media module',
        validation: (rule: ObjectRule) => rule.required(),
      }),
    ),
    defineField(
      Interstitial.builder({
        name: 'interstitial',
        group: 'content',
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
              const defaultSlug = object?.title ?? ''
              if (!defaultSlug) throw new Error('Please add a title to create a unique slug.')
              return defaultSlug.slice(0, 95)
            },
          },
          group: 'content',
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

    // EXPLORE CONTENT

    defineField(
      PageBuilder(
        {
          name: 'exploreContent',
          title: 'Explore',
          group: 'explore',
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
            dzCard: [artwork, book, podcast],
            dzInterstitial: [
              artist,
              {name: 'exhibitionPage', title: 'Exhibition'} as SchemaTypeDefinition,
            ],
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

    // INSTALLATION VIEWS CONTENT

    defineField(
      DzGrid.builder(
        {
          name: 'installationViews',
          title: 'Installation Views',
          group: 'installationViews',
        },
        {
          hideComponentTitle: true,
          references: {},
          components: [GridComponents.dzMedia],
        },
      ),
    ),

    defineField(
      Interstitial.builder({
        name: 'installationViewsInterstitial',
        group: 'installationViews',
        title: 'Installation Views Interstitial',
        options: {collapsible: true, collapsed: true},
      }),
    ),
    defineField({
      name: 'installationViewsSeo',
      title: 'Installation Views SEO',
      type: 'seo',
      group: 'installationViews',
      options: {collapsible: true, collapsed: true},
    }),

    // CHECKLIST CONTENT
    defineField({
      name: 'checklistPDF',
      title: 'Checklist PDF',
      group: 'checklist',
      type: 'file',
      options: {accept: 'application/pdf'},
    }),
    defineField(
      DzGrid.builder(
        {
          name: 'checklist',
          title: 'Artworks',
          group: 'checklist',
        },
        {
          hideComponentTitle: true,
          references: {
            dzCard: [artwork],
          },
          components: [GridComponents.dzCard],
        },
      ),
    ),

    defineField(
      Interstitial.builder({
        name: 'checklistInterstitial',
        group: 'checklist',
        title: 'Checklist Interstitial',
        options: {collapsible: true, collapsed: true},
      }),
    ),
    defineField({
      name: 'checklistSeo',
      title: 'Checklist SEO',
      type: 'seo',
      group: 'checklist',
      options: {collapsible: true, collapsed: true},
    }),

    // PRESS RELEASE CONTENT

    defineField({
      name: 'pressReleasePDF',
      title: 'Press Release PDF',
      group: 'pressRelease',
      type: 'file',
      options: {accept: 'application/pdf'},
    }),
    defineField(
      DzEditorial.builder(
        {
          name: 'pressRelease',
          title: 'Press Release',
          group: 'pressRelease',
          description: 'Editorial Module',
        },
        {references: [], hideComponentTitle: true},
      ),
    ),
    defineField(
      Interstitial.builder({
        name: 'pressReleaseInterstitial',
        group: 'pressRelease',
        title: 'Press Release Interstitial',
        options: {collapsible: true, collapsed: true},
      }),
    ),
    defineField({
      name: 'pressReleaseSEO',
      title: 'Press Release SEO',
      type: 'seo',
      group: 'pressRelease',
      options: {collapsible: true, collapsed: true},
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
})
