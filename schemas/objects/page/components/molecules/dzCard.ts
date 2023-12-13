import {ComposeIcon, EditIcon, SquareIcon, MasterDetailIcon} from '@sanity/icons'
import {
  defineField,
  defineType,
  SchemaTypeDefinition,
  defineArrayMember,
  ObjectDefinition,
} from 'sanity'
import blockContentSimple from '../../../utils/blockContentSimple'
import * as Video from '../../../utils/video'
import * as Media from '../../../utils/media'

type ReferenceOptions = {[key: string]: string}
type dzCardOptions = {
  references: SchemaTypeDefinition[]
  video?: Video.MediaOptions
  referencesFilter?: ReferenceOptions
}

export const getDzCardFields = (options: dzCardOptions) => [
  defineField({
    type: 'string',
    name: 'bookVariation',
    group: 'content',
    title: 'Book Card type',
    options: {
      list: [
        {title: 'Product card Book', value: 'productCard'},
        {title: 'Content card Book', value: 'contentCard'},
      ],
    },
    // On book types attached, select Book Card type
    hidden: ({parent}) => {
      return parent?.content?.[0]?._type !== 'book'
    },
  }),

  // (Content card) Supported Modules for “Moving Images” ONLY
  defineField(
    Media.builder(
      {
        name: 'mediaOverride',
        title: 'Card Media Override',
        group: 'overrides',
      },
      {
        video: {type: Video.MediaTypes.MOVING_IMAGE},
      },
    ),
  ),

  defineField({
    name: 'secondaryTitle',
    title: 'Secondary Title',
    description:
      'This will override the secondary title for selected press variation on press articles.',
    type: 'string',
    group: 'overrides',
    // Secondary Title (for selected press variation)
    hidden: ({parent}) => {
      return parent?.content?.[0]?._type !== 'article'
    },
  }),
  defineField({
    name: 'primarySubtitle',
    title: 'Primary Subtitle',
    type: 'string',
    group: 'overrides',
  }),
  defineField({
    name: 'secondarySubtitle',
    title: 'Secondary Subtitle',
    description: 'This will override the secondary subtitle for news articles only.',
    type: 'string',
    group: 'overrides',
  }),
  defineField({
    name: 'additionalInformation',
    title: 'Additional Information',
    group: 'overrides',
    type: 'array',
    of: blockContentSimple,
  }),
  defineField({
    name: 'primaryCTA',
    title: 'Primary CTA',
    type: 'cta',
    group: 'overrides',
  }),
  defineField({
    name: 'secondaryCTA',
    title: 'Secondary CTA',
    type: 'cta',
    group: 'overrides',
  }),
  defineField({
    name: 'content',
    title: 'Content',
    type: 'array',
    group: 'content',
    icon: MasterDetailIcon,
    validation: (rule) => rule.max(1).required(),
    of: options.references.map((reference) => {
      const filterForReference = options?.referencesFilter?.[reference.name]
      const extraOptions = filterForReference ? {options: {filter: filterForReference}} : {}
      return defineArrayMember({
        name: reference.name,
        title: reference.title,
        type: 'reference',
        to: [{type: reference.name}],
        ...extraOptions,
      })
    }),
  }),
  defineField({
    name: 'enableOverrides',
    type: 'boolean',
    title: 'Enable Overrides',
    group: 'overrides',
    initialValue: false,
  }),
]

export const builder = (
  params: {name: string; title: string; [key: string]: any} = {
    name: 'dzCard',
    title: 'Card',
  },
  options: dzCardOptions,
) => ({
  type: 'object',
  icon: SquareIcon,
  groups: [
    {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
    {name: 'overrides', title: 'Overrides', icon: EditIcon},
  ],
  preview: {
    select: {
      contentTitle: 'content.0.title',
      locationTitle: 'content.0.name',
      artistTitle: 'content.0.fullName',
      artworkMedia: 'content.0.photos.0.image',
      exhibitionCardMedia: 'content.0.cardViewMedia.image',
      exhibitionMediaHero: 'content.0.heroMedia.image',
      articleWithArtworkMedia: 'content.0.header.0.photos.0.image',
      articleMedia: 'content.0.header.0.media.image',
      articleMediaSelected: 'content.0.image.image',
      bookMedia: 'content.0.photos.0',
      locationMedia: 'content.0.photos',
      artistMedia: 'content.0.picture',
    },
    prepare: ({
      contentTitle,
      locationTitle,
      artistTitle,
      artworkMedia,
      exhibitionCardMedia,
      exhibitionMediaHero,
      articleWithArtworkMedia,
      articleMedia,
      bookMedia,
      locationMedia,
      artistMedia,
      articleMediaSelected,
    }: any) => {
      const mediaObject =
        artworkMedia ??
        exhibitionCardMedia ??
        exhibitionMediaHero ??
        articleWithArtworkMedia ??
        articleMedia ??
        bookMedia ??
        artistMedia ??
        locationMedia ??
        articleMediaSelected ??
        SquareIcon

      const titleObject = contentTitle ?? locationTitle ?? artistTitle

      return {
        title: titleObject,
        media: mediaObject,
        icon: SquareIcon,
      }
    },
  },
  fields: getDzCardFields(options),
  ...params,
})

export default defineType(
  builder(
    {name: 'dzCard', title: 'Card'},
    {references: [], video: {type: Video.MediaTypes.MOVING_IMAGE}},
  ),
) as ObjectDefinition
