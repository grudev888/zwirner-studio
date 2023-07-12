import {type DocumentDefinition, type ObjectDefinition, SchemaTypeDefinition} from 'sanity'

import article from './documents/article'
import artist from './documents/artist'
import artwork from './documents/artwork'
import authorType from './documents/author'
import bookType from './documents/book'
import podcast from './documents/podcast'
import collection from './documents/collection'
import event from './documents/event'
import exhibition from './documents/exhibition'
import globalSEO from './documents/globalSEO'
import locationType from './documents/location'
import pageType from './documents/page'
import artistPage from './documents/pages/artistPage'
import exhibitionPage from './documents/pages/exhibitionPage'
import fairPage from './documents/pages/fairPage'
import press from './documents/press'
import redirects from './documents/redirects'
import strings from './documents/strings'

import footer from './singletons/footer'
import navigation from './singletons/navigation'
import availableArtworks from './singletons/availableArtworks'
import collect from './singletons/collect'
import home from './singletons/home'
import settings from './singletons/settings'
import stories from './singletons/stories'
import utopiaEditions from './singletons/utopiaEditions'
import consignments from './singletons/consignments'
import artworkListing from './singletons/artistListing'

import social from './objects/data/social'
import dzCard from './objects/page/components/molecules/dzCard'
import dzCarousel from './objects/page/components/molecules/dzCarousel'
import dzEditorial from './objects/page/components/molecules/dzEditorial'
import dzHero from './objects/page/components/molecules/dzHero'
import dzHeroCarousel from './objects/page/components/molecules/DzHeroCarousel'
import dzInterstitial from './objects/page/components/molecules/dzInterstitial'
import dzSplit from './objects/page/components/molecules/dzSplit'
import dzTitle from './objects/page/components/molecules/dzTitle'
import grid from './objects/page/grid'
import row from './objects/page/layout'
import pageBuilderComponents from './objects/page/pageBuilderComponents'
import pageContent from './objects/page/pageContent'
import pageContentList from './objects/page/pageContentList'
import seo from './objects/page/seo'
import addressType from './objects/utils/address'
import breadcrumbItem from './objects/utils/breadcrumbItem'
import brickAndMortar from './objects/utils/brickAndMortar'
import cta from './objects/utils/cta'
import dateRange from './objects/utils/dateRange'
import dateSelection from './objects/utils/dateSelection'
import jsonLD from './objects/utils/jsonLdSchema'
import link from './objects/utils/link'
import media from './objects/utils/media'
import textComplex from './objects/utils/textComplex'
import menu from './objects/navigation/menu'
import menuItemLink from './objects/navigation/menuItemLink'
import menuItemPage from './objects/navigation/menuItemPage'
import slugUrl from './objects/utils/slugUrl'
import dzConsignment from './objects/page/components/molecules/dzConsignment'
import dzButton from './objects/page/components/atoms/dzButton'
import dzCardMedia from './objects/page/components/molecules/dzCard/dzCardMedia'
import interstitial from './objects/page/components/primitives/interstitial'
import hero from './objects/page/components/primitives/hero'
import splitModule from './objects/page/components/modules/splitModule'
import carouselModule from './objects/page/components/modules/carouselModule'
import gridModule from './objects/page/components/modules/gridModule'

export const utilsObjects: SchemaTypeDefinition[] = [
  textComplex,
  cta,
  link,
  media,
  brickAndMortar,
  jsonLD,
  breadcrumbItem,
  slugUrl,
]

export const primitiveComponents: ObjectDefinition[] = [interstitial, hero]

export const pageComponents: ObjectDefinition[] = [
  dzHero,
  dzCard,
  dzEditorial,
  dzInterstitial,
  dzSplit,
  dzTitle,
  dzHeroCarousel,
  dzCarousel,
  dzButton,
  dzCardMedia,
  dzConsignment,
]

export const pageModules: ObjectDefinition[] = [splitModule, carouselModule, gridModule]

export const objects: ObjectDefinition[] = [
  social,
  addressType,
  dateSelection,
  seo,
  row,
  grid,
  menu,
  menuItemLink,
  menuItemPage,
]

export const pageDocuments: DocumentDefinition[] = [artistPage, exhibitionPage, fairPage]

export const singletons: DocumentDefinition[] = [artworkListing, settings, stories, home, collect, utopiaEditions, globalSEO, availableArtworks, navigation, consignments, footer]

export const schema: {types: SchemaTypeDefinition[] } = {
  types: [
    article,
    press,
    pageType,
    bookType,
    podcast,
    locationType,
    event,
    artwork,
    collection,
    strings,
    exhibition,
    artist,
    authorType,
    dateRange,
    redirects,
    pageContent,
    pageContentList,
    pageBuilderComponents,
    ...pageDocuments,
    ...objects,
    ...pageComponents,
    ...pageModules,
    ...primitiveComponents,
    ...singletons,
    ...utilsObjects,
  ],
}
