import {ImageIcon} from '@sanity/icons'
import {defineField, defineType, StringRule, ObjectDefinition, ObjectRule} from 'sanity'
import * as Media from '../../../../objects/utils/media'

type dzMediaOptions = {
  hideComponentTitle?: boolean
  mediaProps?: Media.MediaOptions
}

export const getDzMediaFields = (options: dzMediaOptions) => [
  defineField(
    Media.builder(
      {
        name: 'media',
        title: 'Media',
        description: 'Media module',
        validation: (rule: ObjectRule) => rule.required(),
      },
      {
        video: {enabledSelection: true},
        ...options?.mediaProps,
      },
    ),
  ),
]

export const builder = (
  params: {name: string; title: string; [key: string]: any} = {
    name: 'dzMedia',
    title: 'Media',
  },
  options: dzMediaOptions = {hideComponentTitle: false},
) => ({
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Component title',
      ...(!options?.hideComponentTitle ? {validation: (rule: StringRule) => rule.required()} : {}),
      hidden: options?.hideComponentTitle,
      initialValue: 'Media',
    }),
    // (DzMedia) Modules to support both “Moving Images” and “Interactive Video”
    ...getDzMediaFields(options),
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
