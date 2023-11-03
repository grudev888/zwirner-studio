import {BlockElementIcon} from '@sanity/icons'
import {ObjectDefinition, defineField, defineType} from 'sanity'
import {builder as CTABuilder, CtaActions} from '../../../utils/cta'
import * as Media from '../../../utils/media'

type InterstitialOptions = {
  excludeFields?: string[]
  references?: any
  ctaOptions?: CtaActions[]
  hideCtaOptions?: boolean
}

// Custom & Ecomm must be added on demand if needed
const DEFAULT_INTERSTITIAL_CTA_OPTIONS = [
  CtaActions.NEWSLETTER,
  CtaActions.LINK,
  CtaActions.DOWNLOAD_PDF,
  CtaActions.LINK_CONTENT,
  CtaActions.INQUIRE,
]

const fields = (options?: InterstitialOptions) => [
  defineField({name: 'title', type: 'string', title: 'Primary Title'}),
  defineField({
    name: 'eyebrow',
    type: 'string',
    title: 'Eyebrow',
  }),
  defineField({name: 'subtitle', type: 'string', title: 'Description'}),
  // (Interstitial) Supported Modules for “Moving Images” ONLY
  defineField(
    Media.builder(
      {
        name: 'image',
        title: 'Interstitial Media',
      },
      {
        type: Media.MediaTypes.IMAGE,
      },
    ),
  ),
  defineField(
    CTABuilder(
      {name: 'cta', title: 'CTA'},
      {
        linkContentEnabled: true,
        ctaOptions: options?.ctaOptions ? options?.ctaOptions : DEFAULT_INTERSTITIAL_CTA_OPTIONS,
        hideCtaOptions: options?.hideCtaOptions,
      },
    ),
  ),
  defineField({name: 'mode', type: 'string', options: {list: ['Light', 'Dark']}, title: 'Mode'}),
]

export const builder = (
  params: {name: string; title: string; [key: string]: any} = {
    name: 'dzInterstitial',
    title: 'Interstitial',
  },
  options?: InterstitialOptions,
) => {
  const {excludeFields} = options || {excludeFields: []}
  return {
    type: 'object',
    icon: BlockElementIcon,
    fields: fields(options).filter((field) => !excludeFields?.includes(field.name)),
    ...params,
  }
}

export default defineType(
  builder({name: 'interstitial', title: 'Interstitial'}),
) as ObjectDefinition
