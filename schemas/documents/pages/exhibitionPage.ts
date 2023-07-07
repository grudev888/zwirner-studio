import {BlockElementIcon, ComposeIcon, SearchIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {apiVersion} from '../../../env'
import {exhibitionById} from '../../../queries/exhibition.queries'
import exhibition from '../../../schemas/documents/exhibition'
import {builder as slugURLBuilder} from '../../objects/utils/slugUrl'

export default defineType({
  name: 'exhibitionPage',
  title: 'Exhibition Page',
  type: 'document',
  icon: BlockElementIcon,
  preview: {
    select: {title: 'title', photos: 'exhibition.photos'},
    prepare: ({title, photos}) => ({title, media: photos?.[0]}),
  },
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
      validation: (rule) => rule.required(),
    }),
    defineField(
      slugURLBuilder(
        {
          name: 'slug',
          title: 'Slug',
          options: {
            source: (object: any, context: any) => {
              const exhibitionRef = object?.exhibition?._ref
              const defaultSlug = object?.title ?? ''

              if (!exhibitionRef && !defaultSlug)
                throw new Error('Please add a title or an exhibition to create a unique slug.')

              if (!exhibitionRef) return defaultSlug

              const {getClient} = context
              const client = getClient({apiVersion})
              const params = {exhibitionId: exhibitionRef}
              return client.fetch(exhibitionById, params).then((result: any) => {
                const [exhibition] = result ?? []
                return exhibition?.title ?? defaultSlug
              })
            },
          },
          group: 'content',
        },
        {
          prefix: async (parent, client) => {
            const exhibitionId = parent.exhibition?._ref
            const exhibition = await client.fetch(`*[_id == $exhibitionId][0]`, {exhibitionId})
            const dateFormatter = new Intl.DateTimeFormat('en-US', {
              timeZone: 'UTC',
              year: 'numeric',
            })
            const year = dateFormatter.format(new Date(exhibition.endDate))
            return `/exhibitions/${year}`
          },
        }
      )
    ),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'exhibition',
      title: 'Exhibition',
      type: 'reference',
      group: 'content',
      to: [{type: exhibition.name}],
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
