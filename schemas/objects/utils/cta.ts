//Todo import from the design system import {BUTTON_VARIANTS, ButtonVariant} from '@zwirner/design-system'
import {defineField} from 'sanity'

import {linkSchemaType} from '../../../schemas/objects/utils/link'

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

export interface CTASchemaType {
  type: 'button' | 'link'
  action: CtaActions
  text: string
  link?: linkSchemaType
  variant?: ButtonVariant
}

export default defineField({
  name: 'cta',
  title: 'CTA',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      type: 'string',
      title: 'CTA Text',
    }),
    defineField({
      name: 'action',
      type: 'string',
      title: 'CTA Type',
      options: {
        list: [
          CtaActions.NEWSLETTER,
          CtaActions.LINK,
          CtaActions.DOWNLOAD_PDF,
          CtaActions.LINK_CONTENT,
          CtaActions.INQUIRE,
          CtaActions.ECOMM,
          CtaActions.CUSTOM,
        ],
      },
    }),
    defineField({
      name: 'file',
      title: 'File Download',
      type: 'file',
      options: {accept: 'application/pdf'},
      hidden: ({parent}) => parent?.action !== 'Download PDF',
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
      hidden: ({parent}) => parent?.action !== 'Link',
    }),
  ],
})
