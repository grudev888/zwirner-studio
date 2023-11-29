import {MasterDetailIcon} from '@sanity/icons'
import {SchemaTypeDefinition, defineType} from 'sanity'
import {builder as dzHeroBuilder} from '../page/components/molecules/dzHero'
import {builder as dzHeroCarouselBuilder} from '../page/components/molecules/DzHeroCarousel'
import {builder as dzEditorialBuilder} from '../page/components/molecules/dzEditorial'
import {builder as dzCarouselBuilder} from '../page/components/molecules/dzCarousel'
import {builder as dzCardBuilder} from '../page/components/molecules/dzCard'
import {builder as dzSplitBuilder} from '../page/components/molecules/dzSplit'
import {builder as dzTitleBuilder} from '../page/components/molecules/dzTitle'
import {builder as dzInterstitialBuilder} from '../page/components/primitives/interstitial'
import {builder as dzMediaBuilder} from '../page/components/molecules/dzMedia'
import {builder as oneUpBuilder} from '../page/components/molecules/oneUpWrapper'
import {builder as dzGridBuilder} from '../page/grid'

export enum PageBuilderComponents {
  dzCard = 'dzCard',
  dzCarousel = 'dzCarousel',
  dzEditorial = 'dzEditorial',
  dzGrid = 'grid',
  dzHero = 'dzHero',
  dzHeroCarousel = 'dzHeroCarousel',
  dzInterstitial = 'dzInterstitial',
  dzMedia = 'dzMedia',
  dzSplit = 'dzSplit',
  dzTitle = 'dzTitle',
  oneUp = 'oneUp',
}

export type BuilderOptions = {
  components?: PageBuilderComponents[]
  required?: boolean
}
const componentBuilder = {
  [PageBuilderComponents.dzHero]: dzHeroBuilder,
  [PageBuilderComponents.dzHeroCarousel]: dzHeroCarouselBuilder,
  [PageBuilderComponents.dzGrid]: dzGridBuilder,
  [PageBuilderComponents.dzInterstitial]: dzInterstitialBuilder,
  [PageBuilderComponents.dzEditorial]: dzEditorialBuilder,
  [PageBuilderComponents.dzSplit]: dzSplitBuilder,
  [PageBuilderComponents.dzTitle]: dzTitleBuilder,
  [PageBuilderComponents.dzCarousel]: dzCarouselBuilder,
  [PageBuilderComponents.dzCard]: dzCardBuilder,
  [PageBuilderComponents.dzMedia]: dzMediaBuilder,
  [PageBuilderComponents.oneUp]: oneUpBuilder,
}

export type ReferencePerType = {
  [key in PageBuilderComponents]?: any
}
export type FullReferencePerType = ReferencePerType & {all?: SchemaTypeDefinition[]}
export type OptionsPerType = ReferencePerType & {all?: any}
export type PageBuilderOptions = {
  components: PageBuilderComponents[]
  references: FullReferencePerType
  componentOptions?: OptionsPerType
}

const getComponents = (
  list: PageBuilderComponents[],
  references: FullReferencePerType,
  componentOptions?: any,
) => {
  return list.map((component: PageBuilderComponents) => {
    if (
      component === PageBuilderComponents.dzGrid ||
      component === PageBuilderComponents.dzCarousel
    ) {
      return componentBuilder[component](undefined, {
        references: references[component]?.references ?? references?.all ?? [],
        components: references[component]?.components,
        ...componentOptions?.[component],
      })
    }
    return componentBuilder[component](undefined, {
      references: references[component] ?? references.all ?? [],
      ...componentOptions?.[component],
    })
  })
}

export const builder = (
  params: {name: string; title: string; [key: string]: any},
  options: PageBuilderOptions,
): any => ({
  type: 'array',
  icon: MasterDetailIcon,
  of: getComponents(
    options?.components?.sort((first, second) => {
      const normalizedFirst = first?.toLowerCase()?.replace(/dz/g, '')
      const normalizedSecond = second?.toLowerCase()?.replace(/dz/g, '')
      return normalizedFirst > normalizedSecond ? 1 : -1
    }) ?? Object.values(PageBuilderComponents),
    options.references,
    options.componentOptions,
  ),
  ...params,
})

export default defineType(
  builder(
    {name: 'pageBuilderComponents', title: 'Components'},
    {
      components: Object.values(PageBuilderComponents),
      references: {all: [{name: 'exhibitionPage', title: 'Exhibition'} as SchemaTypeDefinition]},
    },
  ),
) as SchemaTypeDefinition
