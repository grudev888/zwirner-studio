import {DefaultDocumentNodeResolver} from 'sanity/desk'
import {Iframe} from 'sanity-plugin-iframe-pane'

import {iframeOptions} from '../../draftView/draftViewSettings'

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType}) => {
  switch (schemaType) {
    case 'article':
    case 'artistPage':
    case 'exhibitionPage':
      return S.document().views([
        S.view.form(),
        S.view.component(Iframe).options(iframeOptions).title('Draft View'),
      ])
    default:
      return S.document().views([S.view.form()])
  }
}
