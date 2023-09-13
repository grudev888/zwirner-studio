import {MasterDetailIcon} from '@sanity/icons'
import {defineField, defineType, ObjectDefinition, ObjectRule} from 'sanity'
import * as Media from '../../../../objects/utils/media'

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
  }
) => ({
  type: 'object',
  icon: MasterDetailIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Component title',
    }),
    defineField(
      Media.builder({
        name: 'media',
        title: 'Media',
        description: 'Media module',
        validation: (rule: ObjectRule) => rule.required(),
      })
    ),
    defineField({
      type: 'string',
      name: 'caption',
      title: 'Caption',
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
