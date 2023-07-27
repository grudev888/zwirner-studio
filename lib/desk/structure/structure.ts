import {
  BlockElementIcon,
  BookIcon,
  CogIcon,
  DashboardIcon,
  DocumentsIcon,
  LinkRemovedIcon,
  PinIcon,
  ComposeIcon,
  ThLargeIcon,
  TiersIcon,
  TrendUpwardIcon,
  UsersIcon,
  ImagesIcon,
  StackCompactIcon,
  ActivityIcon,
} from '@sanity/icons'
import {StructureBuilder} from 'sanity/desk'

import {envHost} from './../../../env'
import {ReferenceByTab} from './../../overrides/overrides'
import {PreviewIframe} from './../../preview/customIframe/previewIframe'
import {getSectionsByYear} from './structure.service'

import article from '../../../schemas/documents/article'
import exhibitionPage from '../../../schemas/documents/pages/exhibitionPage'
import {getPreviewUrl, getSingletonPreviewUrl} from './utils'

export const generalStructure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Web Settings')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Web Settings')
            .items([
              S.listItem()
                .title('Global SEO')
                .icon(TrendUpwardIcon)
                .child(S.document().schemaType('globalSEO').documentId('globalSEO')),
              S.listItem()
                .title('Redirects')
                .icon(LinkRemovedIcon)
                .child(S.documentList().title('Page Redirects').filter('_type == "redirect"')),
              S.listItem()
                .title('Global Strings')
                .icon(TiersIcon)
                .child(S.documentList().title('Strings').filter('_type == "strings"')),
              S.listItem()
                .title('Main Navigation')
                .icon(BlockElementIcon)
                .child(S.document().schemaType('navigation').documentId('navigation')),
              S.listItem()
                .title('Footer Links')
                .icon(BlockElementIcon)
                .child(S.document().schemaType('footer').documentId('footer')),
            ])
        ),
      S.divider(),
      S.listItem()
        .title('Web Pages')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Web Pages')
            .items([
              S.listItem()
                .title('Home')
                .icon(BlockElementIcon)
                .child(
                  S.document()
                    .schemaType('home')
                    .documentId('home')
                    .views([
                      S.view.form(),
                      S.view
                        .component(PreviewIframe)
                        .options({
                          url: getSingletonPreviewUrl('/'),
                        })
                        .title('Preview'),
                    ])
                ),
              S.listItem()
                .title('Artists')
                .icon(BlockElementIcon)
                .child(
                  S.document()
                    .schemaType('artistListing')
                    .documentId('artistListing')
                    .views([
                      S.view.form(),
                      S.view
                        .component(PreviewIframe)
                        .options({
                          url: getSingletonPreviewUrl('/artists'),
                        })
                        .title('Preview'),
                    ])
                ),
              S.listItem()
                .title('Collect')
                .icon(BlockElementIcon)
                .child(
                  S.document()
                    .schemaType('collect')
                    .documentId('collect')
                    .views([
                      S.view.form(),
                      S.view
                        .component(PreviewIframe)
                        .options({
                          url: getSingletonPreviewUrl('/collect'),
                        })
                        .title('Preview'),
                    ])
                ),
              S.listItem()
                .title('Stories')
                .icon(BlockElementIcon)
                .child(
                  S.document()
                    .schemaType('stories')
                    .documentId('stories')
                    .views([
                      S.view.form(),
                      S.view
                        .component(PreviewIframe)
                        .options({
                          url: getSingletonPreviewUrl('/stories'),
                        })
                        .title('Preview'),
                    ])
                ),
              S.listItem()
                .title('Available Artworks')
                .icon(ThLargeIcon)
                .child(
                  S.document()
                    .schemaType('availableArtworks')
                    .documentId('availableArtworks')
                    .views([
                      S.view.form(),
                      S.view
                        .component(PreviewIframe)
                        .options({
                          url: getSingletonPreviewUrl('/available-artworks'),
                        })
                        .title('Preview'),
                    ])
                ),
              S.listItem()
                .title('Utopia Editions')
                .icon(BlockElementIcon)
                .child(
                  S.document()
                    .schemaType('utopiaEditions')
                    .documentId('utopiaEditions')
                    .views([
                      S.view.form(),
                      S.view
                        .component(PreviewIframe)
                        .options({
                          url: getSingletonPreviewUrl('/utopia-editions'),
                        })
                        .title('Preview'),
                    ])
                ),
              S.listItem()
                .title('Consignments')
                .icon(BlockElementIcon)
                .child(
                  S.document()
                    .schemaType('consignments')
                    .documentId('consignments')
                    .views([
                      S.view.form(),
                      S.view
                        .component(PreviewIframe)
                        .options({
                          url: getSingletonPreviewUrl('/consignments'),
                        })
                        .title('Preview'),
                    ])
                ),
              S.divider(),
              S.listItem()
                .title('Articles')
                .icon(ComposeIcon)
                .child(() => getSectionsByYear({S, document: article})),

              S.listItem()
                .title('Artist Pages')
                .icon(UsersIcon)
                .child(
                  S.documentList()
                    .title('Artist Pages')
                    .filter('_type == "artistPage"')
                    .defaultOrdering([{field: 'artist->lastName', direction: 'asc'}])
                    .child((childId) =>
                      S.document()
                        .id(childId)
                        .schemaType('artistPage')
                        .views([
                          S.view.form(),
                          S.view
                            .component(PreviewIframe)
                            .options({url: getPreviewUrl})
                            .title('Preview'),
                          S.view.component(ReferenceByTab).title('References'),
                        ])
                    )
                ),
              S.listItem()
                .title('Exhibitions')
                .icon(DashboardIcon)
                .child(() => getSectionsByYear({S, document: exhibitionPage})),
            ])
        ),
      S.divider(),
      S.listItem()
        .title('Artists')
        .icon(UsersIcon)
        .child(
          S.list()
            .title('Artists')
            .items([
              S.listItem()
                .title('Dz Gallery Artists')
                .icon(UsersIcon)
                .child(
                  S.documentList()
                    .title('Artists')
                    .filter('_type == "artist" && affiliation == true')
                    .defaultOrdering([{field: 'lastName', direction: 'asc'}])
                    .child(
                      S.document()
                        .schemaType('artist')
                        .views([
                          S.view.form(),
                          S.view.component(ReferenceByTab).title('References'),
                        ])
                    )
                ),
              S.listItem()
                .title('Non Dz Gallery Artists')
                .icon(UsersIcon)
                .child(
                  S.documentList()
                    .schemaType('artist')
                    .title('Artists')
                    .filter('_type == "artist" && affiliation == false')
                    .defaultOrdering([{field: 'lastName', direction: 'asc'}])
                    .child(
                      S.document()
                        .schemaType('artist')
                        .views([
                          S.view.form(),
                          S.view.component(ReferenceByTab).title('References'),
                        ])
                    )
                ),
            ])
        ),
      S.listItem()
        .title('Artworks')
        .icon(ImagesIcon)
        .child(
          S.documentTypeList('artwork')
            .title('Artworks')
            .defaultOrdering([{field: 'title', direction: 'asc'}])
            .child((childId) =>
              S.document()
                .id(childId)
                .schemaType('artwork')
                .views([
                  S.view.form(),
                  S.view
                    .component(PreviewIframe)
                    .options({url: getPreviewUrl})
                    .title('Preview'),
                  S.view.component(ReferenceByTab).title('References'),
                ])
            )
        ),
      // S.listItem()
      //   .title('Artworks by Artist')
      //   .icon(ImagesIcon)
      //   .child(
      //     S.documentTypeList('artist')
      //       .title('Artworks by Artist')
      //       .defaultOrdering([{field: 'lastName', direction: 'asc'}])
      //       .child((artistId) =>
      //         S.documentList()
      //           .title('Artworks')
      //           .filter('_type == "artwork" && $artistId in artists[]._ref')
      //           .params({artistId})
      //       )
      //   ),
      S.listItem()
        .title('Authors')
        .icon(UsersIcon)
        .child(
          S.documentList()
            .title('Authors')
            .filter('_type == "author"')
            .defaultOrdering([{field: 'name', direction: 'asc'}])
            .child(
              S.document()
                .schemaType('author')
                .views([S.view.form(), S.view.component(ReferenceByTab).title('References')])
            )
        ),
      S.listItem()
        .title('Books')
        .icon(BookIcon)
        .child(
          S.documentList()
            .title('Books')
            .filter('_type == "book"')
            .defaultOrdering([{field: 'title', direction: 'asc'}])
            .child(
              S.document()
                .schemaType('book')
                .views([S.view.form(), S.view.component(ReferenceByTab).title('References')])
            )
        ),
      S.listItem()
        .title('Collections')
        .icon(StackCompactIcon)
        .child(
          S.documentList()
            .title('Collections')
            .filter('_type == "collection"')
            .defaultOrdering([{field: 'title', direction: 'asc'}])
            .child(
              S.document()
                .schemaType('collection')
                .views([S.view.form(), S.view.component(ReferenceByTab).title('References')])
            )
        ),
      S.listItem()
        .title('Locations')
        .icon(PinIcon)
        .child(
          S.documentList()
            .title('Locations')
            .filter('_type == "location"')
            .schemaType('location')
            .defaultOrdering([{field: 'name', direction: 'asc'}])
            .child(
              S.document()
                .schemaType('location')
                .views([S.view.form(), S.view.component(ReferenceByTab).title('References')])
            )
        ),
      S.listItem()
        .title('Podcasts')
        .icon(ActivityIcon)
        .child(
          S.documentTypeList('podcast')
            .title('Podcasts')
            .defaultOrdering([{field: 'dateSelection', direction: 'asc'}])
        ),
    ])
