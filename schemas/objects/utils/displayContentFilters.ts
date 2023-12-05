import {defineField, defineType, SchemaTypeDefinition} from 'sanity'
import {
  ARTWORK_NAME,
  ArtWorkComplementaryFields,
  ArtWorkDefaultFields,
} from '../../documents/artwork'

export enum ContentMolecules {
  grid = 'grid',
  dzCarousel = 'dzCarousel',
  oneUp = 'oneUp',
}

export type DisplayContentOptions = {
  type: ContentMolecules
  referenceName: string
}

const fieldsPerReferenceType: Record<string, any> = {
  [ARTWORK_NAME]: {
    default: ArtWorkDefaultFields,
    complementary: ArtWorkComplementaryFields,
  },
}

const getReferenceFields = (fields: Record<string, string>, isDefault = false) => {
  return Object.entries(fields).map(([title, value]) => {
    return defineField({
      name: value,
      title: title,
      type: 'boolean',
      initialValue: isDefault,
      options: {
        layout: 'checkbox',
      },
    })
  })
}

export const builder = (
  params: {name: string; title: string; [key: string]: any},
  options: DisplayContentOptions,
) => ({
  hidden: ({parent}: any) => {
    let hasArtworks = false
    if (options.type === ContentMolecules.oneUp) {
      hasArtworks = parent?.content?.some((item: any) => item?._type === options.referenceName)
    } else {
      hasArtworks = parent?.[options.type]?.some(
        (item: any) => item?.content?.[0]?._type === options.referenceName,
      )
    }
    return !hasArtworks
  },
  type: 'object',
  options: {
    columns: 2,
  },
  fields: [
    ...getReferenceFields(fieldsPerReferenceType?.[options.referenceName]?.default ?? {}, true),
    ...getReferenceFields(
      fieldsPerReferenceType?.[options.referenceName]?.complementary ?? {},
      false,
    ),
  ],
  ...params,
})

export default defineType(
  builder(
    {name: 'displayFilters', title: 'Display Filters'},
    {type: ContentMolecules.grid, referenceName: ''},
  ),
) as SchemaTypeDefinition
