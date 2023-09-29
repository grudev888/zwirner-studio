import {ComposeIcon, SearchIcon, HomeIcon} from '@sanity/icons'
import {defineField, defineType, StringRule, SchemaTypeDefinition} from 'sanity'

import {builder as PageBuilder, PageBuilderComponents} from '../objects/utils/pageBuilder'
import {GridComponents} from '../objects/page/grid'
import {hiddenSlug} from '../objects/data/hiddenSlug'

import artwork from '../documents/artwork'
import location from '../documents/location'
import book from '../documents/book'
import artist from '../documents/artist'
import podcast from '../documents/podcast'

export default defineType({
  name: 'home',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
  ],
  fields: [
    hiddenSlug,
    defineField({
      name: 'title',
      title: 'Primary Title',
      type: 'string',
      description: 'Will not display on the page, but is used to describe it in the CMS',
      group: 'content',
      validation: (rule: StringRule) => rule.required(),
    }),
    defineField(
      PageBuilder(
        {
          name: 'homeContent',
          title: 'Content',
          group: 'content',
        },
        {
          components: [
            PageBuilderComponents.dzHero,
            PageBuilderComponents.dzInterstitial,
            PageBuilderComponents.dzSplit,
            PageBuilderComponents.dzGrid,
            PageBuilderComponents.dzCarousel,
          ],
          references: {
            dzHero: [{name: 'exhibitionPage', title: 'Exhibition'} as SchemaTypeDefinition],
            dzInterstitial: [
              artwork,
              book,
              artist,
              {name: 'exhibitionPage', title: 'Exhibition'} as SchemaTypeDefinition,
            ],
            dzSplit: [
              {name: 'article', title: 'Article'} as SchemaTypeDefinition,
              {name: 'exhibitionPage', title: 'Exhibition'} as SchemaTypeDefinition,
            ],
            grid: {
              references: {
                dzCard: [book, {name: 'article', title: 'Article'} as SchemaTypeDefinition],
              },
              components: [GridComponents.dzCard],
            },
            dzCarousel: {
              references: {
                dzCard: [
                  book,
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
      name: 'locations',
      title: 'Locations',
      group: 'content',
      type: 'array',
      of: [
        {type: 'reference', name: location.name, title: location.title, to: {type: location.name}},
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
})
