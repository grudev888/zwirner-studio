//Todo import from the design system import {BUTTON_VARIANTS, ButtonVariant} from '@zwirner/design-system'
import {defineField} from 'sanity'

import {linkSchemaType} from '../../../schemas/objects/utils/link'

export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
};

export const BUTTON_VARIANT_NAMES = [
  BUTTON_VARIANTS.PRIMARY,
  BUTTON_VARIANTS.SECONDARY,
  BUTTON_VARIANTS.TERTIARY,
] as const;

export type ButtonVariant = typeof BUTTON_VARIANT_NAMES[number];

export interface CTASchemaType {
  type: 'button' | 'link'
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
      name: 'type',
      type: 'string',
      description: 'Choose between button or link',
      options: {
        list: [
          {title: 'Button', value: 'button'},
          {title: 'Link', value: 'link'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'text',
      type: 'string',
      description: 'Main CTA text',
      hidden: ({parent}) => {
        return !parent?.type
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'link',
      type: 'link',
      description: 'Choose between internal or external links',
      hidden: ({parent}) => {
        return parent?.type === 'button' || !parent?.type
      },
    }),
    defineField({
      name: 'variant',
      type: 'string',
      description: 'Variation of the button, check https://bit.ly/436tjps',
      options: {
        list: [
          {title: 'Primary', value: BUTTON_VARIANTS.PRIMARY},
          {title: 'Secondary', value: BUTTON_VARIANTS.SECONDARY},
          {title: 'Tertiary', value: BUTTON_VARIANTS.TERTIARY},
        ],
      },
      hidden: ({parent}) => {
        return parent?.type === 'link' || !parent?.type
      },
    }),
  ],
})
