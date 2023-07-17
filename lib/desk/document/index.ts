import {DefaultDocumentNodeResolver} from 'sanity/desk'
import {PreviewIframe} from '../../preview/customIframe/previewIframe'
import {getPreviewUrl} from '../structure/utils'

const schemaTypeToSection = (type: string) => ({
  article: 'news',
  artistPage: 'artists',
  exhibitionPage: 'exhibitions',
  fairPage: 'fairs',
  artwork: 'artworks',
})

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType}) => {
  switch (schemaType) {
    case 'article':
    case 'artistPage':
    case 'artwork':
    case 'exhibitionPage':
    case 'fairPage':
      return S.document().views([
        S.view.form(),
        S.view
          .component(PreviewIframe)
          .options({url: getPreviewUrl})
          .title('Preview'),
      ])
    default:
      return S.document().views([S.view.form()])
  }
}
