import {ComposeIcon, EditIcon, MasterDetailIcon} from '@sanity/icons'
import {
  ObjectDefinition,
  defineArrayMember,
  defineField,
  defineType,
  SchemaTypeDefinition,
} from 'sanity'
import {MediaTypes} from '../../../utils/video'
import * as Content from '../../../utils/contentWrapper'

export interface DzHeroSchemaProps {
  title: string
  headingOverride?: string
  subHeadingOverride?: string
  secondaryTitleOverride?: string
  descriptionOverride?: string
  imageOverride?: any
  enableOverrides: boolean
}

export const builder = (
  params: {name: string; title: string; [key: string]: any} = {name: 'dzHero', title: 'Hero'},
  options: {references: SchemaTypeDefinition[]},
) => ({
  type: 'object',
  icon: MasterDetailIcon,
  groups: [
    {name: 'content', title: 'Content', icon: ComposeIcon, default: true},
    {name: 'overrides', title: 'Overrides', icon: EditIcon},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Component title',
      group: 'content',
      initialValue: 'Hero',
    }),

    // (Hero) Supported Modules for “Moving Images” ONLY
    // All card sizes (XL/L/M/S) will support “Moving Images”
    defineField({
      name: 'content',
      title: 'Content',
      group: 'content',
      type: 'array',
      icon: MasterDetailIcon,
      of: [
        defineArrayMember(
          Content.builder(
            {
              name: 'linkedContent',
              title: 'Linked Content',
              group: 'content',
            },
            {
              references: options.references,
              validation: (rule: any) => rule.max(1),
              video: {
                type: MediaTypes.MOVING_IMAGE,
              },
            },
          ),
        ),
      ],
    }),

    defineField({
      name: 'enableOverrides',
      type: 'boolean',
      title: 'Enable Overrides',
      group: 'overrides',
      initialValue: false,
    }),
    defineField({
      name: 'imageOverride',
      type: 'image',
      title: 'Image',
      group: 'overrides',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          hidden: true,
        },
        {
          name: 'url',
          type: 'string',
          title: 'Url redirect',
        },
      ],
    }),
    defineField({
      name: 'categoryOverride',
      type: 'string',
      title: 'Category',
      group: 'overrides',
    }),
    defineField({
      name: 'headingOverride',
      type: 'string',
      title: 'Title',
      group: 'overrides',
    }),
    defineField({
      name: 'subHeadingOverride',
      type: 'string',
      title: 'Subtitle',
      group: 'overrides',
    }),
    defineField({
      name: 'secondaryTitleOverride',
      type: 'string',
      title: 'Secondary Title',
      group: 'overrides',
    }),
    defineField({
      name: 'descriptionOverride',
      type: 'string',
      title: 'Description',
      group: 'overrides',
    }),
    defineField({name: 'CTAOverride', type: 'string', title: 'CTA Title', group: 'overrides'}),
    defineField({
      name: 'linkCTAOverride',
      type: 'url',
      title: 'Link CTA',
      group: 'overrides',
      validation: (rule) => rule.uri({allowRelative: true}),
    }),
  ],
  ...params,
})

export default defineType(
  builder({name: 'dzHero', title: 'Hero'}, {references: []}),
) as ObjectDefinition
