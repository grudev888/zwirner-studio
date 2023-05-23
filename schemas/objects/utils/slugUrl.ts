import {defineType} from 'sanity'
import {slugify} from '../../../lib/util/strings'

export default defineType({
  name: 'slugUrl',
  title: 'Slug',
  description:
    'Unique slug based on the article name. It will represent the page URL and the canonical URL for SEO purposes.',
  type: 'slug',
  options: {
    source: (object: any) => {
      const defaultSlug = object?.title ?? ''
      if (!defaultSlug) throw new Error('Please add a title to create a unique slug.')
      return defaultSlug.slice(0, 95)
    },
    maxLength: 96,
    isUnique: (value, context) => context.defaultIsUnique(value, context),
    slugify: (input) => {
      const normalized = slugify(input).slice(0, 95)
      const hasSlash = input.substring(0, 1) === '/'
      return hasSlash ? normalized : `/${normalized}`
    },
  },
  validation: (Rule) =>
    Rule.custom((slug) => {
      const {current = ''} = slug ?? {}
      if (!current) return 'The slug cannot be empty.'
      const spaceCount = current.split(' ').length - 1
      if (spaceCount) return 'The slug cannot have spaces.'
      const isNotLowerCase = current.toLowerCase() !== current
      if (isNotLowerCase) return 'The slug must be in lowercase.'
      const hasSlash = current.substring(0, 1) !== '/'
      if (hasSlash) return "The slug must start with '/'"
      return true
    }),
})
