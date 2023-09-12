import {
  BlockElementIcon,
  ComposeIcon,
  SearchIcon,
  ImageIcon,
  DocumentVideoIcon,
  DocumentIcon,
} from '@sanity/icons'
import * as Interstitial from '../../objects/page/components/primitives/interstitial'
import {GreyFootNote, GreyFootNoteDecorator} from '../../../components/block/GreyFootnote'
import {ObjectRule, defineArrayMember, defineField, defineType} from 'sanity'
import * as Media from '../../objects/utils/media'
import {builder as slugURLBuilder} from '../../objects/utils/slugUrl'
import artistType from '../artist'
import artwork from '../artwork'
import location from '../location'

export default defineType({
  name: 'exhibitionPage',
  title: 'Exhibition',
  type: 'document',
  icon: BlockElementIcon,
  preview: {
    select: {title: 'title', photos: 'photos'},
    prepare: ({title, photos}) => ({title, media: photos?.[0]}),
  },
  groups: [
    {name: 'content', title: 'Exhibition', icon: ComposeIcon, default: true},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
    {name: 'pressRelease', title: 'Press Release', icon: DocumentIcon},
    {name: 'explore', title: 'Explore', icon: DocumentIcon},
    {name: 'installationViews', title: 'Installation Views', icon: DocumentIcon},
    {name: 'checklist', title: 'Checklist', icon: DocumentIcon},
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
      title: 'Primary Title',
      type: 'string',
      description:
        'It will be combined with Primary Subtitle to display the full title: [Primary Title]: [Primary Subtitle]. If no subtitle is added then only Primary Title should be displayed. On cards, it is displayed as Primary Title.',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Primary Subtitle',
      type: 'string',
      description:
        'It will be combined with Primary Title to display the full title: [Primary Title]: [Primary Subtitle]. On cards, it is displayed as Primary Subtitle.',
      group: 'content',
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
    defineField({
      name: 'summary',
      title: 'Summary',
      group: 'content',
      description:
        'This is used to describe the exhibition and appears as the text in exhibition cards.',
      type: 'string',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      group: 'content',
      description:
        'This should be a very short phrase that describes the exhibition. It will appear as small text on cards above the title. Max 100 characters.',
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
      validation: (rule) =>
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
    defineField(
      Media.builder(
        {
          name: 'heroMedia',
          title: 'Hero Media',
          group: 'content',
          description: 'Media module',
          validation: (rule: ObjectRule) => rule.required(),
        },
        {video: {providers: [Media.VideoProviders.custom]}},
      ),
    ),
    defineField(
      Interstitial.builder({
        name: 'interstitial',
        group: 'content',
        title: 'Interstitial',
        options: {collapsible: true, collapsed: true},
      }),
    ),

    // EXPLORE CONTENT

    defineField({
      name: 'exploreContent',
      title: 'Explore',
      type: 'pageBuilderComponents',
      group: 'explore',
    }),

    // INSTALLATION VIEWS CONTENT

    defineField({
      title: 'Installation Views',
      name: 'installationViews',
      group: 'installationViews',
      type: 'array',
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
                  const {altText, caption} = image
                  return {title: altText ?? caption, media: image}
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
      ],
    }),
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
    defineField({
      name: 'checklist',
      title: 'Artworks',
      group: 'checklist',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'checklistItem',
          title: 'Checklist Item',
          type: 'reference',
          to: [{type: artwork.name}],
        }),
      ],
    }),
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
    defineField({
      name: 'pressRelease',
      title: 'Press Release',
      group: 'pressRelease',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          name: 'block',
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {
                title: 'Grey Note',
                value: 'greyNote',
                icon: GreyFootNote,
                component: GreyFootNoteDecorator,
              },
            ],
          },
        }),
        defineArrayMember(
          Media.builder(
            {
              name: 'bodyImage',
              icon: ImageIcon,
              title: 'Image',
              preview: {select: {media: 'image', title: 'image.caption'}},
            },
            {
              type: Media.MediaTypes.IMAGE,
            },
          ),
        ),
      ],
    }),
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
  ],
})
