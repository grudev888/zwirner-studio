import {MasterDetailIcon} from '@sanity/icons'
import {SchemaTypeDefinition, defineType} from 'sanity'
import {builder as dzHeroBuilder} from '../page/components/molecules/dzHero'
import {builder as dzHeroCarouselBuilder} from '../page/components/molecules/DzHeroCarousel'
import {builder as dzEditorialBuilder} from '../page/components/molecules/dzEditorial'
import {builder as dzInterstitialBuilder} from '../page/components/molecules/dzInterstitial'
import {builder as dzCarouselBuilder} from '../page/components/molecules/dzCarousel'
import {builder as dzSplitBuilder} from '../page/components/molecules/dzSplit'
import {builder as dzTitleBuilder} from '../page/components/molecules/dzTitle'
import {builder as dzGridBuilder} from '../page/grid'
import artist from '../../documents/artist'
import artwork from '../../documents/artwork'
import exhibitionPage from '../../documents/pages/exhibitionPage'

const LIST_OF_REFERENCES = [artist, artwork, exhibitionPage]

export enum PageBuilderComponents {
  dzHero = 'dzHero',
  dzHeroCarousel = 'dzHeroCarousel',
  dzCarousel = 'dzCarousel',
  dzGrid = 'grid',
  dzEditorial = 'dzEditorial',
  dzInterstitial = 'dzInterstitial',
  dzSplit = 'dzSplit',
  dzTitle = 'dzTitle',
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
}

export type ReferencePerType = {
  [key in PageBuilderComponents]?: SchemaTypeDefinition[]
}
export type FullReferencePerType = ReferencePerType & {all?: SchemaTypeDefinition[]}
export type PageBuilderOptions = {
  components: PageBuilderComponents[]
  references?: FullReferencePerType
}

const DEFAULT_REFERENCES: ReferencePerType = Object.values(PageBuilderComponents).reduce(
  (p: any, k) => ({...p, [k]: LIST_OF_REFERENCES}),
  {}
)

const getComponents = (list: PageBuilderComponents[], references: FullReferencePerType) => {
  return list.map((component: PageBuilderComponents) =>
    componentBuilder[component](undefined, {
      references: references[component] ?? references.all ?? LIST_OF_REFERENCES,
    })
  )
}

export const builder = (
  params: {name: string; title: string; [key: string]: any},
  options: PageBuilderOptions
) => ({
  type: 'array',
  icon: MasterDetailIcon,
  of: getComponents(
    options?.components ?? Object.values(PageBuilderComponents),
    options?.references ?? DEFAULT_REFERENCES
  ),
  ...params,
})

export default defineType(
  builder(
    {name: 'pageBuilderComponents', title: 'Components'},
    {
      components: Object.values(PageBuilderComponents),
    }
  )
) as SchemaTypeDefinition
