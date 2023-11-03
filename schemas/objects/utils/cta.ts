//Todo import from the design system import {BUTTON_VARIANTS, ButtonVariant} from '@zwirner/design-system'
import {defineField, defineType, SchemaTypeDefinition} from 'sanity'

export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
}

export const BUTTON_VARIANT_NAMES = [
  BUTTON_VARIANTS.PRIMARY,
  BUTTON_VARIANTS.SECONDARY,
  BUTTON_VARIANTS.TERTIARY,
] as const

export type ButtonVariant = (typeof BUTTON_VARIANT_NAMES)[number]

export enum CtaActions {
  INQUIRE = 'inquire',
  ECOMM = 'ecomm',
  CUSTOM = 'custom',
  NONE = 'none',
  NEWSLETTER = 'Newsletter',
  LINK = 'Link',
  DOWNLOAD_PDF = 'Download PDF',
  LINK_CONTENT = 'Link Content',
}

const DEFAULT_ACTIONS = [
  CtaActions.NEWSLETTER,
  CtaActions.LINK,
  CtaActions.DOWNLOAD_PDF,
  CtaActions.LINK_CONTENT,
  CtaActions.INQUIRE,
  CtaActions.ECOMM,
  CtaActions.CUSTOM,
]

export type CTAOptions = {
  linkContentEnabled?: boolean
  ctaOptions?: CtaActions[]
  hideCtaOptions?: boolean
}

export const builder = (
  params: {name: string; title: string; [key: string]: any},
  options?: CTAOptions,
) => ({
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      type: 'string',
      title: 'CTA Text',
    }),
    ...(!options?.hideCtaOptions
      ? [
          defineField({
            name: 'action',
            type: 'string',
            title: 'CTA Type',
            options: {
              list: options?.ctaOptions ? options?.ctaOptions : DEFAULT_ACTIONS,
            },
          }),
        ]
      : []),
    defineField({
      name: 'file',
      title: 'File Download',
      type: 'file',
      options: {accept: 'application/pdf'},
      hidden: ({parent}) => parent?.action !== CtaActions.DOWNLOAD_PDF,
    }),
    defineField({
      name: 'link',
      type: 'object',
      title: 'CTA Link',
      options: {collapsible: false},
      fields: [
        defineField({
          name: 'href',
          type: 'url',
          title: 'URL',
          validation: (rule) => rule.uri({allowRelative: true}),
        }),
        defineField({
          name: 'blank',
          title: 'Open in new tab',
          type: 'boolean',
        }),
      ],
      hidden: ({parent}) => parent?.action !== CtaActions.LINK,
    }),
    ...(options?.linkContentEnabled
      ? [
          defineField({
            name: 'linkedContent',
            title: 'Content',
            type: 'reference',
            to: [
              {type: 'article'},
              {type: 'artwork'},
              {type: 'exhibitionPage'},
              {type: 'exceptionalWork'},
              {type: 'artistPage'},
              {type: 'fairPage'},
              {type: 'onlineExhibitionPage'},
              {type: 'page'},
            ],
            options: {filter: 'defined(slug)'},
            hidden: ({parent}) => parent?.action !== CtaActions.LINK_CONTENT,
          }),
        ]
      : []),
  ],
  ...params,
})

export default defineType(builder({name: 'cta', title: 'CTA'})) as SchemaTypeDefinition
