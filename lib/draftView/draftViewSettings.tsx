import home from '../../schemas/singletons/home'
import exhibitionPage from '../../schemas/documents/pages/exhibitionPage'
import artistPage from '../../schemas/documents/pages/artistPage'
import artwork from '../../schemas/documents/artwork'
import availableArtworks from '../../schemas/singletons/availableArtworks'

import {previewSecretId, SANITY_STUDIO_PREVIEW_BASE_URL, envHost} from '../../env'

import {defineUrlResolver, type IframeOptions} from 'sanity-plugin-iframe-pane'
import page from '../../schemas/documents/pages/page'
import exceptionalWork from '../../schemas/documents/exceptionalWork'
import onlineExhibitionPage from '../../schemas/documents/pages/onlineExhibitionPage'
import fairPage from '../../schemas/documents/pages/fairPage'
import artistListing from '../../schemas/singletons/artistListing'
import exhibitionsLanding from '../../schemas/singletons/exhibitionsLanding'
import exhibitionsPast from '../../schemas/singletons/exhibitionsPast'
import article from '../../schemas/documents/article'

export const PREVIEWABLE_DOCUMENT_TYPES = [
  home.name,
  exhibitionPage.name,
  artistPage.name,
  artwork.name,
  availableArtworks.name,
  page.name,
  article.name,
  exceptionalWork.name,
  exhibitionPage.name,
  onlineExhibitionPage.name,
  fairPage.name,
  availableArtworks.name,
  artistListing.name,
  exhibitionsLanding.name,
  exhibitionsPast.name,
] satisfies string[]

export const PREVIEWABLE_DOCUMENT_TYPES_REQUIRING_SLUGS = [
  exhibitionPage.name,
  artistPage.name,
  artwork.name,
  availableArtworks.name,
  page.name,
  article.name,
  exceptionalWork.name,
  exhibitionPage.name,
  onlineExhibitionPage.name,
  fairPage.name,
  availableArtworks.name,
  artistListing.name,
  exhibitionsLanding.name,
  exhibitionsPast.name,
] satisfies typeof PREVIEWABLE_DOCUMENT_TYPES

export const urlResolver = defineUrlResolver({
  base: `${envHost}${SANITY_STUDIO_PREVIEW_BASE_URL}`,
  requiresSlug: PREVIEWABLE_DOCUMENT_TYPES_REQUIRING_SLUGS,
})

export const iframeOptions = {
  url: urlResolver,
  urlSecretId: previewSecretId,
} satisfies IframeOptions
