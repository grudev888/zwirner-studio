import {DefaultDocumentNodeResolver} from 'sanity/desk'
import {PreviewIframe} from '../../preview/customIframe/previewIframe'
import {SanityDocument} from 'sanity'
import {envHost} from '../../../env'

const schemaTypeToSection = (type: string) => ({
  article: 'news',
  artistPage: 'artists',
  exhibitionPage: 'exhibitions',
  fairPage: 'fairs',
  artworkPage: 'artworks',
})

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType}) => {
  switch (schemaType) {
    case 'article':
    case 'artistPage':
    case 'artworkPage':
    case 'exhibitionPage':
    case 'fairPage':
      return S.document().views([
        S.view.form(),
        S.view
          .component(PreviewIframe)
          .options({
            url: (doc: SanityDocument) =>
              `${envHost}/api/sanity/preview?slug=${(doc?.slug as any)?.current?.replace(
                /^\//i,
                ''
              )}&section=${schemaTypeToSection(schemaType)}`,
          })
          .title('Preview'),
      ])
    default:
      return S.document().views([S.view.form()])
  }
}
