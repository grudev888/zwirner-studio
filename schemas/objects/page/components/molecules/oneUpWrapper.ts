import {SquareIcon, ComposeIcon, EditIcon} from '@sanity/icons'
import {
  defineField,
  defineType,
  SchemaTypeDefinition,
  ObjectDefinition,
  StringRule,
  FieldDefinition,
  ConditionalPropertyCallbackContext,
  SlugSourceContext,
} from 'sanity'
import * as Media from '../../../../objects/utils/media'
import * as Video from '../../../utils/video'
import {hideForTypes} from '../../../../../utils/hideSections'
import {getDzCardFields} from './dzCard'
import {getDzMediaFields} from './dzMedia'

enum OneUpMolecules {
  'Card' = 'dzCard',
  'Media' = 'dzMedia',
}

type ReferenceOptions = {[key: string]: string}
type oneUpOptions = {
  references: SchemaTypeDefinition[]
  type?: OneUpMolecules
  video?: Video.MediaOptions
  referencesFilter?: ReferenceOptions
  hideComponentTitle?: boolean
  mediaProps?: Media.MediaOptions
}

const setHiddenPerTypes = (
  fields: FieldDefinition[],
  types: OneUpMolecules[],
  group?: Record<'group', string>,
) => {
  return fields.map((field) => {
    if (typeof field.hidden === 'function') {
      return {
        ...field,
        ...group,
        hidden: (args: SlugSourceContext | ConditionalPropertyCallbackContext) => {
          const {parent} = args ?? {}
          const {hidden} = field ?? {}
          return (hidden as Function)?.(args) || parent?.type === types?.[0]
        },
      }
    }
    return {...field, ...group, hidden: hideForTypes(types)}
  })
}

const getOneUpFields = (options: oneUpOptions) => {
  const cardFields = getDzCardFields(options)
  const mediaFields = getDzMediaFields(options)
  const mediaFieldsHidden = setHiddenPerTypes(mediaFields, [OneUpMolecules.Card])

  return [
    ...setHiddenPerTypes(cardFields, [OneUpMolecules.Media]),
    ...setHiddenPerTypes(mediaFieldsHidden, [OneUpMolecules.Card], {group: 'content'}),
  ]
}

export const builder = (
  params: {name: string; title: string; [key: string]: any} = {
    name: 'oneUp',
    title: '1 Up',
  },
  options: oneUpOptions,
) => ({
  type: 'object',
  icon: SquareIcon,
  groups: [
    {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
    {name: 'overrides', title: 'Overrides', icon: EditIcon},
  ],
  preview: {
    select: {
      type: 'type',
      title: 'title',
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
      title,
      type,
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

      const indexOfType = Object.values(OneUpMolecules).indexOf(type as unknown as OneUpMolecules)

      const oneUpType = Object.keys(OneUpMolecules)[indexOfType]
      const titleObject = contentTitle ?? locationTitle ?? artistTitle ?? `${title}: ${oneUpType}`

      return {
        title: titleObject,
        media: mediaObject,
        icon: SquareIcon,
      }
    },
  },

  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'content',
      title: 'Component title',
      ...(!options?.hideComponentTitle ? {validation: (rule: StringRule) => rule.required()} : {}),
      hidden: options?.hideComponentTitle,
      initialValue: '1-Up',
    }),
    defineField({
      type: 'string',
      name: 'type',
      group: 'content',
      title: '1 Up Type',
      validation: (rule: StringRule) => rule.required(),
      options: {
        list: Object.entries(OneUpMolecules).map(([title, value]) => ({title, value})),
      },
      initialValue: options?.type ?? OneUpMolecules.Card,
    }),
    ...getOneUpFields(options),
  ],
  ...params,
})

export default defineType(
  builder(
    {name: 'oneUp', title: '1 Up'},
    {references: [], video: {type: Video.MediaTypes.MOVING_IMAGE}},
  ),
) as ObjectDefinition
