import {BlockElementIcon, SearchIcon, ComposeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import artwork from '../documents/artwork'
import {hiddenSlug} from '../objects/data/hiddenSlug'
import {builder as dzGridBuilder, GridComponents} from '../objects/page/grid'

export default defineType({
  name: 'availableArtworks',
  title: 'Available Artworks',
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
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField(
      dzGridBuilder(
        {
          name: 'artworksGrid',
          title: 'Artworks Grid',
          group: 'content',
        },
        {
          gridProps: {
            title: 'Artworks',
          },
          hideComponentTitle: true,
          references: {
            dzCard: [artwork],
          },
          components: [GridComponents.dzCard],
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
