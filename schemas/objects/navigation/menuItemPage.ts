import {defineField, defineType} from 'sanity'

import SelectPageAnchor from '../../../components/SelectPageAnchor'

import artistPage from '../../documents/pages/artistPage'
import exhibitionLanding from '../../singletons/exhibitionsLanding'
import artistListing from '../../singletons/artistListing'
import exhibitionPage from '../../documents/pages/exhibitionPage'
import availableArtworks from '../../singletons/availableArtworks'
import collect from '../../singletons/collect'
import consignments from '../../singletons/consignments'
import stories from '../../singletons/stories'
import utopiaEditions from '../../singletons/utopiaEditions'
import {menuCommonFields} from '../utils/menu'

export default defineType({
  type: 'object',
  name: 'menuItemPage',
  title: 'Internal page',
  preview: {select: {title: 'title'}},
  fields: [
    defineField({type: 'string', name: 'title', title: 'Title'}),
    defineField({
      name: 'page',
      title: 'Page',
      type: 'reference',
      to: [
        {type: artistPage.name},
        {type: exhibitionPage.name},
        {type: availableArtworks.name},
        {type: collect.name},
        {type: consignments.name},
        {type: stories.name},
        {type: utopiaEditions.name},
        {type: exhibitionLanding.name},
        {type: artistListing.name},
      ],
    }),
    defineField({
      name: 'anchor',
      title: 'Anchor',
      type: 'string',
      components: {input: SelectPageAnchor},
      // Will be populated on the React component
      options: {list: []},
    }),
    defineField({
      type: 'boolean',
      name: 'newTab',
      title: 'Open in a new tab?',
      initialValue: false,
    }),
    ...menuCommonFields,
  ],
})
