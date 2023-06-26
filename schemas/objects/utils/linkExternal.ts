import {LinkIcon} from '@sanity/icons'

export default {
  name: 'link',
  type: 'object',
  title: 'Link external URL',
  icon: LinkIcon,
  fields: [
    {
      name: 'href',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          allowRelative: false,
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
    },
    {
        title: 'Open in new tab',
        name: 'blank',
        type: 'boolean',
      },
  ],
}
