import {
  defineType,
  SlugValue,
  SlugRule,
  SlugDefinition,
  SanityClient,
  ValidationContext,
  isArray,
} from 'sanity'
import {slugify} from '../../../lib/util/strings'
import {getClientFromContext} from '../../../lib/util/sanity'

// URLs recommended length is 75 chars.
const SLUG_MAX_LENGTH = 75 - 'http://davidzwirner.com/'.length

type UrlPrefix = ((parent: Record<string, any>, client: SanityClient) => Promise<string>) | string

interface ValidateOptions {
  optional?: boolean
  prefix?: UrlPrefix
}

export const validateSlugFormat = async (
  slug: SlugValue | undefined,
  context: ValidationContext,
  options?: ValidateOptions
) => {
  const {optional, prefix} = options ?? {}

  const stringPrefix =
    typeof prefix === 'function'
      ? await prefix(context.parent as Record<string, any>, getClientFromContext(context.getClient))
      : prefix

  if (typeof slug !== 'object' && typeof optional === 'boolean')
    return optional ? true : 'Invalid slug'

  const current = slug?.current
  if (!current) return 'The slug cannot be empty.'

  const spaceCount = current.split(' ').length - 1
  if (spaceCount) return 'The slug cannot have spaces.'

  const isNotLowerCase = current.toLowerCase() !== current
  if (isNotLowerCase) return 'The slug must be in lowercase.'

  if (stringPrefix && !current.startsWith(stringPrefix))
    return 'Prefix missing. Generate the slug again'

  const hasSlash = current.substring(0, 1) !== '/'
  if (hasSlash) return "The slug must start with '/'"

  return true
}

export const validateSlugFormatRule = (rule: SlugRule, options?: ValidateOptions) =>
  rule.custom((value: SlugValue | undefined, context) =>
    validateSlugFormat(value, context, options)
  )

const structure: SlugDefinition = {
  name: 'slugUrl',
  title: 'Slug',
  description:
    'Unique slug that will represent the page URL and the canonical URL for SEO purposes.',
  type: 'slug',
  options: {
    source: (object: any, b: any) => {
      const defaultSlug = object?.title ?? ''
      if (!defaultSlug) throw new Error('Please add a title to create a unique slug.')
      return defaultSlug.slice(0, SLUG_MAX_LENGTH)
    },
    maxLength: 71,
    isUnique: (value, context) => context.defaultIsUnique(value, context),
    slugify: (input, b, c) => {
      const normalized = slugify(input).slice(0, SLUG_MAX_LENGTH)
      const hasSlash = input.substring(0, 1) === '/'
      return hasSlash ? normalized : `/${normalized}`
    },
  },
  validation: (rule: SlugRule) => validateSlugFormatRule(rule),
}

export const builder = (
  params: {name?: string; title: string; [key: string]: any},
  options?: ValidateOptions
): SlugDefinition => {
  if (params.options?.slugify) throw new Error('Overwrite the slugify method is forbidden')

  return {
    ...structure,
    ...params,
    validation: (rule: SlugRule) => [
      validateSlugFormatRule(rule, options),
      ...(isArray(params.validation) ? params.validation : [params.validation]),
    ],
    options: {
      ...structure.options,
      ...params.options,
      slugify: async (input, _, context) => {
        const prefix =
          (typeof options?.prefix === 'function'
            ? await options.prefix(context.parent, getClientFromContext(context.getClient))
            : options?.prefix) || ''

        const normalized = slugify(input).slice(0, SLUG_MAX_LENGTH)
        return `/${prefix}/${normalized}`.replace(/\/+/g, '/')
      },
    },
  }
}

export default defineType(structure)
