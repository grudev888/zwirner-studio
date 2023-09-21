import {MasterDetailIcon} from '@sanity/icons'
import {defineField, defineType, StringRule, ObjectDefinition, ObjectRule} from 'sanity'
import * as Media from '../../../../objects/utils/media'

import blockContentSimple from '../../../utils/blockContentSimple'

export interface DzInterstitialTypeProps {
  title: string
  split: boolean
  imageOverride?: any
  enableOverrides: boolean
}

export const builder = (
  params: {name: string; title: string; [key: string]: any} = {
    name: 'dzMedia',
    title: 'Media',
  },
  options: {
    hideComponentTitle?: boolean
  } = {hideComponentTitle: false},
) => ({
  type: 'object',
  icon: MasterDetailIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Component title',
      ...(!options?.hideComponentTitle ? {validation: (rule: StringRule) => rule.required()} : {}),
      hidden: options?.hideComponentTitle,
    }),
    // (DzMedia) Modules to support both “Moving Images” and “Interactive Video”
    defineField(
      Media.builder(
        {
          name: 'media',
          title: 'Media',
          description: 'Media module',
          validation: (rule: ObjectRule) => rule.required(),
        },
        {
          // This enables video type selection
          video: {enabledSelection: true},
        },
      ),
    ),
    defineField({
      name: 'caption',
      type: 'array',
      title: 'Caption',
      of: blockContentSimple,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      image: 'media',
    },
    prepare({title, image}: any) {
      const {alt, caption, image: innerImg} = image ?? {}
      return {title: title ?? alt ?? caption, media: innerImg}
    },
  },
  ...params,
})

export default defineType(builder({name: 'dzMedia', title: 'media'})) as ObjectDefinition
