import {DocumentTextIcon, ComposeIcon, SearchIcon} from '@sanity/icons'
import {defineField, defineType, SchemaTypeDefinition} from 'sanity'
import {builder as PageBuilder, PageBuilderComponents} from '../../objects/utils/pageBuilder'
import {GridComponents} from '../../objects/page/grid'
import blockContentSimple from '../../objects/utils/blockContentSimple'
import {franchiseBrandingField} from '../../objects/data/franchiseBranding'
import {hiddenSlug} from '../../objects/data/hiddenSlug'

import artwork from '../artwork'
import location from '../location'
import book from '../book'
import artist from '../artist'
import podcast from '../podcast'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentTextIcon,
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
      description: 'Primary Title of the page. On cards, it is displayed as Primary Title.',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Primary Subtitle',
      type: 'string',
      description: 'Primary Subtitle of the page. On cards, it is displayed as Primary Subtitle.',
      group: 'content',
    }),
    defineField({
      name: 'summary',
      title: 'Description',
      group: 'content',
      description: 'This is used to describe the page and appears as the text in page cards.',
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
    defineField(franchiseBrandingField({group: 'content'})),

    // CONTENT

    defineField(
      PageBuilder(
        {
          name: 'content',
          title: 'Content',
          group: 'content',
        },
        {
          components: [
            PageBuilderComponents.dzHero,
            PageBuilderComponents.dzInterstitial,
            PageBuilderComponents.dzSplit,
            PageBuilderComponents.dzEditorial,
            PageBuilderComponents.dzGrid,
            PageBuilderComponents.dzCarousel,
            PageBuilderComponents.oneUp,
          ],
          references: {
            dzHero: [{name: 'exhibitionPage', title: 'Exhibition'} as SchemaTypeDefinition],
            oneUp: [
              artwork,
              book,
              location,
              artist,
              podcast,
              {name: 'article', title: 'Article'} as SchemaTypeDefinition,
              {name: 'exhibitionPage', title: 'Exhibition'} as SchemaTypeDefinition,
            ],
            dzSplit: [
              podcast,
              {name: 'exhibitionPage', title: 'Exhibition'} as SchemaTypeDefinition,
            ],
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
