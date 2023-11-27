import {StringRule, defineField, defineType, NumberRule, defineArrayMember} from 'sanity'
import blockContentSimple from './utils/blockContentSimple'
import * as Media from '../objects/utils/media'
import {SplitHorizontalIcon} from '@sanity/icons'
import {toTitle} from '../../utils/textTransform'
import {hideForTypes} from '../../utils/hideSections'

enum PopUpTypes {
  'Newsletter' = 'newsletter',
  'Inquire' = 'inquire',
  'Custom Newsletter' = 'customNewsletter',
  'Custom Promo' = 'customPromo',
}

enum PopUpTriggers {
  'Time Based' = 'timeBased',
  'Scroll Based' = 'scrollBased',
}

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
        columns: 2,
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
        defineField({
          name: PopUpTriggers['Scroll Based'],
          title: 'Scroll Based',
          type: 'boolean',
          initialValue: false,
          options: {
            layout: 'checkbox',
          },
        }),
        defineField({
          name: 'triggerTime',
          title: 'Trigger Time',
          description: 'Time in seconds',
          type: 'number',
          initialValue: 15,
          hidden: ({parent}) => !parent?.timeBased,
          validation: (rule: NumberRule) => rule.min(0),
        }),
        defineField({
          name: 'scrollValue',
          title: 'Scroll Percentage',
          description: 'Percentage of the page scrolled. (0-100)',
          type: 'number',
          initialValue: 50,
          hidden: ({parent}) => !parent?.scrollBased,
          validation: (rule: NumberRule) => rule.min(0).integer().max(100),
        }),
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
      hidden: hideForTypes([PopUpTypes.Inquire, PopUpTypes.Newsletter]),
    }),
    defineField({
      type: 'array',
      name: 'description',
      title: 'Description',
      description: 'Popup description text.',
      hidden: hideForTypes([PopUpTypes.Inquire, PopUpTypes.Newsletter]),
      of: blockContentSimple,
    }),
    defineField({
      name: 'primaryCTA',
      title: 'CTA Button',
      type: 'cta',
      hidden: hideForTypes([PopUpTypes.Inquire, PopUpTypes.Newsletter]),
    }),
    defineField({
      name: 'submissionCTA',
      title: 'Submission success CTA',
      hidden: hideForTypes([
        PopUpTypes['Custom Newsletter'],
        PopUpTypes.Inquire,
        PopUpTypes.Newsletter,
      ]),
      type: 'cta',
    }),
    defineField(
      Media.builder(
        {
          name: 'desktopMedia',
          title: 'Desktop Media',
          description: 'Desktop Image',
          hidden: hideForTypes([
            PopUpTypes['Custom Promo'],
            PopUpTypes.Inquire,
            PopUpTypes.Newsletter,
          ]),
        },
        {type: Media.MediaTypes.IMAGE},
      ),
    ),
    defineField(
      Media.builder(
        {
          name: 'promoMedia',
          title: 'Promo Media',
          description: 'Promo Image',
          hidden: hideForTypes([
            PopUpTypes['Custom Newsletter'],
            PopUpTypes.Inquire,
            PopUpTypes.Newsletter,
          ]),
        },
        {type: Media.MediaTypes.IMAGE},
      ),
    ),
    defineField(
      Media.builder(
        {
          name: 'mobileMedia',
          title: 'Mobile Media',
          description: 'Mobile Image',
          hidden: hideForTypes([
            PopUpTypes['Custom Promo'],
            PopUpTypes.Inquire,
            PopUpTypes.Newsletter,
          ]),
        },
        {type: Media.MediaTypes.IMAGE},
      ),
    ),
  ],
})
