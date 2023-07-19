import {BlockElementIcon, ComposeIcon, SearchIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {apiVersion} from '../../../env'
import {exhibitionById} from '../../../queries/exhibition.queries'
import exhibitionPage from '../pages/exhibitionPage'
import slugUrl from '../../objects/utils/slugUrl'

export default defineType({
  name: 'fairPage',
  title: 'Fair Page',
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        ...slugUrl.options,
        source: (object: any, context) => {
          const exhibitionRef = object?.exhibitionPage?._ref
          const defaultSlug = object?.title ?? ''
          if (!defaultSlug && !exhibitionRef)
            throw new Error('Please add a title or an exhibition to create a unique slug.')

          if (!exhibitionRef) return defaultSlug

          const {getClient} = context
          const client = getClient({apiVersion})
          const params = {exhibitionId: exhibitionRef}
          return client.fetch(exhibitionById, params).then((result) => {
            const [exhibition] = result ?? []
            return exhibition?.title ?? defaultSlug
          })
        },
      },
      group: 'content',
    }),
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
      to: [{type: exhibitionPage.name}],
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
