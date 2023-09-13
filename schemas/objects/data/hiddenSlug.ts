import {defineField} from 'sanity'
import {slugify} from '../../../lib/util/strings'

export const hiddenSlug = 
  defineField({
    name: 'slug',
    type: 'slug',
    title: 'Slug (restricted access field)',
    group: 'seo',
    options: {
        maxLength: 71,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
        slugify: (input) => {
          const normalized = slugify(input).slice(0, 120)
          const hasSlash = input.substring(0, 1) === '/'
          return hasSlash ? normalized : `/${normalized}`
        },
      },
    hidden: ({currentUser}) => {
        const userRoles = currentUser?.roles?.map(role => role.name);
            return !userRoles.includes('administrator') && !userRoles.includes('developer');
      },
  })
