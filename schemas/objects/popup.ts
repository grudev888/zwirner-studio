import {
  StringRule,
  defineField,
  defineType,
  NumberRule,
  defineArrayMember,
  Rule,
  RuleDef,
} from 'sanity'
import * as Media from '../objects/utils/media'
import {SplitHorizontalIcon} from '@sanity/icons'
import {toTitle} from '../../utils/textTransform'
import {hideForTypes} from '../../utils/hideSections'

enum PopUpTypes {
  'Newsletter' = 'newsletter',
  'Inquire' = 'inquire',
  'Custom Promo' = 'customPromo',
}

enum PopUpTriggers {
  'Time Based' = 'timeBased',
  'Scroll Based' = 'scrollBased',
}

type CTAValueType = {
  text?: string
  action?: string
  link?: {href?: string; blank?: boolean}
}
type MediaValueType = {
  type?: Media.MediaTypes
  image?: {asset?: {_ref: string}; url?: string}
}

const findKey = (value: PopUpTypes) =>
  Object.keys(PopUpTypes)[Object.values(PopUpTypes).indexOf(value)]

const requireForTypes =
  <T extends RuleDef<T>>(types: PopUpTypes[]) =>
  (rule: T) =>
    rule.custom((value, context) =>
      types.includes((context.parent as any).type) && !!value === false
        ? `This field is required when Popup Type is ${types.map(findKey).join(', ')}`
        : true,
    )

export default defineType({
  name: 'popup',
  title: 'PopUp',
  type: 'object',

  preview: {
    select: {
      name: 'name',
      type: 'type',
    },
    prepare({name, type}) {
      return {title: name ?? toTitle(type), media: SplitHorizontalIcon}
    },
  },

  fields: [
    defineField({
      type: 'string',
      name: 'name',
      title: 'Name',
      validation: (rule: StringRule) => rule.required(),
    }),
    defineField({
      type: 'string',
      name: 'type',
      title: 'Popup Type',
      validation: (rule: StringRule) => rule.required(),
      options: {
        list: Object.entries(PopUpTypes).map(([title, value]) => ({title, value})),
      },
      initialValue: PopUpTypes.Newsletter,
    }),
    defineField({
      name: 'displayAlways',
      title: 'Display Always',
      type: 'boolean',
      initialValue: false,
      description:
        'This will override one pop-up per campaign per session, so multiple pop-ups within the same campaign can be shown to a website visitor if the visitor goes to the pages selected.',
    }),
    defineField({
      title: 'Triggers',
      name: 'triggers',
      description:
        'Choose between time-based, scroll-based, or enable both triggers to display the pop-up based on the first occurrence (either time or scroll).',
      type: 'object',
      options: {
        columns: 1,
      },
      validation: (rule) =>
        rule.custom((value) => {
          if (!value?.scrollBased && !value?.timeBased) {
            return 'At least one trigger should be selected'
          }
          return true
        }),
      fields: [
        defineField({
          name: PopUpTriggers['Time Based'],
          title: 'Time Based',
          type: 'boolean',
          initialValue: false,
          options: {
            layout: 'checkbox',
          },
        }),
        // temporary disabled (post-ADP)
        // defineField({
        //   name: PopUpTriggers['Scroll Based'],
        //   title: 'Scroll Based',
        //   type: 'boolean',
        //   initialValue: false,
        //   options: {
        //     layout: 'checkbox',
        //   },
        // }),
        defineField({
          name: 'triggerTime',
          title: 'Trigger Time',
          description: 'Time in seconds',
          type: 'number',
          initialValue: 15,
          hidden: ({parent}) => !parent?.timeBased,
          validation: (rule: NumberRule) => rule.min(0),
        }),
        // temporary disabled (post-ADP)
        // defineField({
        //   name: 'scrollValue',
        //   title: 'Scroll Percentage',
        //   description: 'Percentage of the page scrolled. (0-100)',
        //   type: 'number',
        //   initialValue: 50,
        //   hidden: ({parent}) => !parent?.scrollBased,
        //   validation: (rule: NumberRule) => rule.min(0).integer().max(100),
        // }),
      ],
    }),

    defineField({
      name: 'filterSections',
      title: 'Filter Sections',
      type: 'array',
      validation: (rule) => rule.required(),
      of: [
        defineArrayMember({
          type: 'filterSections',
        }),
      ],
    }),

    defineField({
      type: 'string',
      name: 'title',
      title: 'Primary Title',
      hidden: hideForTypes([PopUpTypes.Inquire]),
      validation: requireForTypes<StringRule>([PopUpTypes['Custom Promo']]),
    }),
    defineField({
      type: 'text',
      name: 'description',
      title: 'Description',
      description: 'Popup description text.',
      validation: requireForTypes<StringRule>([PopUpTypes['Custom Promo']]),
      hidden: hideForTypes([PopUpTypes.Inquire]),
    }),
    defineField({
      name: 'primaryCTA',
      title: 'CTA Button',
      type: 'cta',
      validation: (rule) =>
        rule.custom((value, context) => {
          const {type} = context.parent as {type: PopUpTypes}
          if (type === PopUpTypes['Custom Promo']) {
            if (!value) return 'CTA is required'
            const {text, action, link} = value as CTAValueType
            if (!text) return 'CTA text is required'
            if (!action || action !== 'Link') return 'CTA Type is required and must be a "Link"'
            if (!link) return 'CTA Link data is required'
            if (!link.href) return 'CTA Link href is required'
            if (typeof link.blank !== 'boolean') return 'Choose "open in new tab" behavior'
            if (!value && type === PopUpTypes['Custom Promo']) return 'CTA is required'
          }
          return true
        }),
      hidden: hideForTypes([PopUpTypes.Inquire]),
    }),
    defineField(
      Media.builder(
        {
          name: 'media',
          title: 'Popup Media',
          description: 'Popup Image',
          hidden: hideForTypes([PopUpTypes.Inquire]),
          validation: (rule: Rule) =>
            rule.custom(async (value, context) => {
              const {type: valueType, image} = (value ?? {}) as MediaValueType
              const {type} = context.parent as {type: PopUpTypes}
              if (!valueType && type !== PopUpTypes['Inquire']) {
                return 'Media Type should be defined. If an image is not needed, choose "Unset"'
              }
              if (type === PopUpTypes['Custom Promo'] && valueType !== Media.MediaTypes.IMAGE) {
                return 'Media Type should be "Image"'
              }
              if (valueType === Media.MediaTypes.IMAGE) {
                if (!image || !image.asset?._ref) return 'Image is required'
              }
              return true
            }),
        },
        {type: Media.MediaTypes.IMAGE, defaultUnset: true},
      ),
    ),
  ],
})
