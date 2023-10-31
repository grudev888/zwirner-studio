import {MasterDetailIcon, SquareIcon} from '@sanity/icons'
import {
  ObjectDefinition,
  defineArrayMember,
  defineField,
  defineType,
  RuleBuilder,
  SchemaTypeDefinition,
} from 'sanity'
import * as Video from './video'

export const builder = (
  params: {name: string; title: string; [key: string]: any} = {
    name: 'contentWrap',
    title: 'Linked Content',
  },
  options: {
    references: SchemaTypeDefinition[]
    video?: Video.MediaOptions
    validation?: RuleBuilder<any>
  },
) => ({
  type: 'object',
  icon: MasterDetailIcon,
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
  fields: [
    defineField(
      Video.builder(
        {
          name: 'videoOverride',
          title: 'Moving Image Video',
        },
        ...[options?.video],
      ),
    ),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      icon: MasterDetailIcon,
      validation: options.validation,
      of: options.references.map((reference) =>
        defineArrayMember({
          name: reference.name,
          title: reference.title,
          type: 'reference',
          to: [{type: reference.name}],
        }),
      ),
    }),
  ],
  ...params,
})

export default defineType(
  builder({name: 'contentWrap', title: 'Linked Content'}, {references: []}),
) as ObjectDefinition
