import {defineField, defineType} from 'sanity'

import slugUrl from '../../objects/utils/slugUrl'
import artwork from '../artwork'
import {apiVersion} from '../../../env'
import {artworkById} from '../../../queries/artwork.queries'
import {randomIntString} from '../../../lib/util/strings'
import {ComposeIcon, SearchIcon} from '@sanity/icons'

const CTAOptionsList = [
  {title: 'Inquire', value: 'inquire'},
  {title: 'E-Comm', value: 'e-comm'},
  {title: 'Custom', value: 'custom'},
  {title: 'None', value: 'none'},
]

export default defineType({
  name: 'artworkPage',
  title: 'Artwork',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
  ],
  fields: [
    defineField({
      name: 'artwork',
      title: 'Artwork',
      type: 'reference',
      group: 'content',
      to: [{type: artwork.name}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        ...slugUrl.options,
        source: (object: any, context) => {
          const artworkRef = object?.artwork?._ref
          const defaultSlug = object.title ?? ''

          if (!defaultSlug && !artworkRef)
            throw new Error('Please add a title or an artwork to create a unique slug.')

          if (!artworkRef) return defaultSlug

          const {getClient} = context
          const client = getClient({apiVersion})
          const params = {artworkId: artworkRef}

          return client.fetch(artworkById, params).then((result: any) =>{
            const [artwork] = result ?? []

            if (!artwork.title) {
              return defaultSlug
            }

            return `${artwork.title}${artwork.dateSelection.year || ''}${randomIntString(5)}`
          })
        }
      }
    }),
    defineField({
      name: 'CTA',
      title: 'CTA',
      type: 'string',
      initialValue: 'none',
      options: {
        list: CTAOptionsList,
      },
    }),
    defineField({
      name: 'CTAText',
      title: 'CTA Text',
      type: 'string',
      hidden: ({ parent }) => parent.CTA === 'none'
    }),
    defineField({
      name: 'CTALink',
      title: 'CTA Link',
      type: 'url',
      hidden: ({ parent }) => parent.CTA !== 'custom'
    }),
    defineField({
      name: 'secondaryCTA',
      title: 'Secondary CTA',
      type: 'string',
      initialValue: 'none',
      options: {
        list: CTAOptionsList,
      },
    }),
    defineField({
      name: 'SecondaryCTAText',
      title: 'Secondary CTA Text',
      type: 'string',
      hidden: ({ parent }) => parent.secondaryCTA === 'none'
    }),
    defineField({
      name: 'SecondaryCTALink',
      title: 'Secondary CTA Link',
      type: 'url',
      hidden: ({ parent }) => parent.secondaryCTA !== 'custom'
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number'
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      options: {
        list: ['USD', 'EUR', 'GBP', 'HKD']
      }
    }),
    defineField({
      name: 'additionalCaption',
      title: 'Additional Caption',
      type: 'text',
    }),
    defineField({
      name: 'editionInformation',
      title: 'Edition Information',
      type: 'text',
    }),
    defineField({
      name: 'copyrightInformation',
      title: 'Copyright Information',
      type: 'text',
    }),
    defineField({
      name: 'salesInformation',
      title: 'Sales Information',
      type: 'text',
    }),
    defineField({
      name: 'productInformation',
      title: 'Product Information',
      type: 'text',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
  ]
})
