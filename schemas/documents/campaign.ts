import {CaseIcon} from '@sanity/icons'
import {NumberRule, defineField, defineType} from 'sanity'
import {apiVersion} from '../../env'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export default defineType({
  name: 'campaign',
  title: 'Campaign',
  icon: CaseIcon,
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          const {document, getClient} = context
          const client = getClient({apiVersion})
          const id = document!._id.replace(/^drafts\./, '')
          const params = {
            draft: `drafts.${id}`,
            published: id,
            title: value,
          }
          // Search for unique campaign titles
          const query = `defined(*[_type=="campaign" && !(_id in [$draft, $published]) && title == $title][0]._id)`
          const result = await client.fetch(query, params)
          if (result) return 'Please add a unique title for the campaign.'
          return true
        }),
    }),
    defineField({
      name: 'cookieDaysToExpire',
      title: 'Cookie Expire Days',
      description:
        'Number of days after which browser cookie for the pop-up will expire. Once expired, the same pop-up will be displayed to the user if they visit the same page after the cookie has expired.',
      type: 'number',
      initialValue: 0,
      validation: (rule: NumberRule) => rule.integer().min(0).max(365).required(),
    }),
    orderRankField({type: 'category'}),
    defineField({
      name: 'popupsList',
      title: 'Popups',
      type: 'array',
      description: 'Popups for the campaign',
      of: [{type: 'popup'}],
    }),
  ],
})
