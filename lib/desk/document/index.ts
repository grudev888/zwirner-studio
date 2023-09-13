import {DefaultDocumentNodeResolver} from 'sanity/desk'
import {PreviewIframe} from '../../preview/customIframe/previewIframe'
import {getPreviewUrl} from '../structure/utils'

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType}) => {
  switch (schemaType) {
    case 'article':
    case 'artistPage':
    case 'exhibitionPage':
      return S.document().views([
        S.view.form(),
        S.view.component(PreviewIframe).options({url: getPreviewUrl}).title('Preview'),
      ])
    default:
      return S.document().views([S.view.form()])
  }
}
