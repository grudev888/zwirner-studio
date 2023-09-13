import {LinkIcon} from '@sanity/icons'

export default {
  name: 'internalLink',
  type: 'object',
  title: 'Link internal page',
  icon: LinkIcon,
  fields: [
    {
      name: 'reference',
      type: 'reference',
      title: 'Reference',
      to: [{type: 'article'}, {type: 'exhibitionPage'}],
    },
  ],
}
