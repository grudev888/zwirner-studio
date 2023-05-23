import {BlockElementIcon, ComposeIcon, SearchIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {apiVersion} from '../../../env'
import {artistById} from '../../../queries/artist.queries'

import article from '../article'

export interface ArticlePageSchemaProps {
  title: string
  slug: any
  seo: any
  artist: any
}

export default defineType({
  name: 'articlePage',
  title: 'Article Page',
  type: 'document',
  icon: BlockElementIcon,
  groups: [
    {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      group: 'content',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        },
        {
          name: 'url',
          type: 'string',
          title: 'Url redirect',
        },
      ],
    }),
    defineField({
      name: 'artile',
      title: 'Article',
      type: 'reference',
      group: 'content',
      to: [{type: article.name}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'To generate a unique slug based on the article name.',
      type: 'slug',
      options: {
        source: (object: any, context) => {
          const artistRef = object?.artist?._ref
          const defaultSlug = object?.title ?? ''
          if (!defaultSlug) throw new Error('Please add a title to create a unique slug.')
          if (artistRef) {
            const {getClient} = context
            const client = getClient({apiVersion})
            const params = {artistId: artistRef}
            return client.fetch(artistById, params).then((result) => {
              const [artist] = result ?? []
              return artist?.fullName ?? defaultSlug
            })
          }
          return defaultSlug
        },
        maxLength: 96,
      },
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'components',
      title: 'Components',
      type: 'pageBuilderComponents',
      group: 'content',
    }),
  ],
})
