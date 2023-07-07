import {BlockElementIcon, ComposeIcon, SearchIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {builder as slugBuilder} from '../../objects/utils/slugUrl'
import {apiVersion} from '../../../env'
import {artistById} from '../../../queries/artist.queries'

import artist from '../artist'

export interface ArtistPageSchemaProps {
  title: string
  slug: any
  seo: any
  artist: any
}

export default defineType({
  name: 'artistPage',
  title: 'Artist Page',
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
    defineField(
      slugBuilder(
        {
          name: 'slug',
          title: 'Slug',
          options: {
            source: (object: any, context: any) => {
              const artistRef = object?.artist?._ref
              const defaultSlug = object?.title ?? ''

              if (!defaultSlug && !artistRef)
                throw new Error('Please add a title or an artist to create a unique slug.')

              if (!artistRef) return defaultSlug

              const {getClient} = context
              const client = getClient({apiVersion})
              const params = {artistId: artistRef}

              return client.fetch(artistById, params).then((result: any) => {
                const [artist] = result ?? []
                return artist?.fullName ?? defaultSlug
              })
            },
          },
          group: 'content',
        },
        {prefix: '/artists'}
      )
    ),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'artist',
      title: 'Artist',
      type: 'reference',
      group: 'content',
      to: [{type: artist.name}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'components',
      title: 'Components',
      type: 'pageBuilderComponents',
      group: 'content',
    }),
  ],
})
