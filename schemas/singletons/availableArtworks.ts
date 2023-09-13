import {BlockElementIcon, SearchIcon, ComposeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {builder as gridBuilder} from '../objects/page/components/modules/gridModule'
import artwork from '../documents/artwork'
import { hiddenSlug } from '../objects/data/hiddenSlug'

export default defineType({
  name: 'availableArtworks',
  title: 'Available Works',
  type: 'document',
  icon: BlockElementIcon,
  groups: [
    {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
  ],
  fields: [
    hiddenSlug,
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField(
      gridBuilder(
        {
          name: 'artworksGrid',
          title: 'Artworks Grid',
          group: 'content',
        },
        {excludedFields: ['title'], reference: artwork}
      )
    ),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
})
