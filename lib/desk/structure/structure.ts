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
  InfoOutlineIcon,
  ActivityIcon,
  PlayIcon,
  RobotIcon,
} from '@sanity/icons'
import {StructureBuilder} from 'sanity/desk'

import {Iframe} from 'sanity-plugin-iframe-pane'

import {iframeOptions} from '../../draftView/draftViewSettings'

import {ReferenceByTab} from './../../overrides/overrides'
import {getSectionsByYear} from './structure.service'

import article from '../../../schemas/documents/article'
import exhibitionPage from '../../../schemas/documents/pages/exhibitionPage'
import onlineExhibition from '../../../schemas/documents/pages/onlineExhibitionPage'
import fair from '../../../schemas/documents/pages/fairPage'
import exceptionalWork from '../../../schemas/documents/exceptionalWork'

export const generalStructure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Settings')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Settings')
            .items([
              S.listItem()
                .title('General Settings')
                .icon(CogIcon)
                .child(S.document().schemaType('settings').documentId('settings')),
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
              S.divider(),
              S.listItem()
                .title('Products')
                .schemaType('product')
                .child(
                  S.documentTypeList('product').child((id) =>
                    S.list()
                      .title('Product')
                      .items([
                        // Details
                        S.listItem()
                          .title('Details')
                          .icon(InfoOutlineIcon)
                          .child(S.document().schemaType('product').documentId(id)),
                        // Product variants
                        S.listItem()
                          .title('Variants')
                          .schemaType('productVariant')
                          .child(
                            S.documentList()
                              .title('Variants')
                              .schemaType('productVariant')
                              .filter(`_type == "productVariant" && store.productId == $productId`)
                              .params({
                                productId: Number(id.replace('shopifyProduct-', '')),
                              }),
                          ),
                      ]),
                  ),
                ),
              S.listItem()
                .title('Collections')
                .schemaType('collection')
                .child(S.documentTypeList('collection')),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Special Pages')
        .icon(DocumentsIcon)
        .child(
          S.documentList()
            .title('Special Pages')
            .filter('_type == "page"')
            .defaultOrdering([{field: 'name', direction: 'asc'}])
            .child((childId) =>
              S.document()
                .id(childId)
                .schemaType('page')
                .views([
                  S.view.form(),
                  S.view.component(Iframe).options(iframeOptions).title('Draft View'),
                  S.view.component(ReferenceByTab).title('References'),
                ]),
            ),
        ),
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
                      S.view.component(Iframe).options(iframeOptions).title('Draft View'),
                    ]),
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
                      S.view.component(Iframe).options(iframeOptions).title('Draft View'),
                    ]),
                ),
              S.listItem()
                .title('Exhibitions Landing')
                .icon(BlockElementIcon)
                .child(
                  S.document()
                    .schemaType('exhibitionsLanding')
                    .documentId('exhibitionsLanding')
                    .views([
                      S.view.form(),
                      S.view.component(Iframe).options(iframeOptions).title('Draft View'),
                    ]),
                ),
              S.listItem()
                .title('Exhibitions Past')
                .icon(BlockElementIcon)
                .child(
                  S.document()
                    .schemaType('exhibitionsPast')
                    .documentId('exhibitionsPast')
                    .views([
                      S.view.form(),
                      S.view.component(Iframe).options(iframeOptions).title('Draft View'),
                    ]),
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
                      S.view.component(Iframe).options(iframeOptions).title('Draft View'),
                    ]),
                ),
              S.divider(),
              S.listItem()
                .title('Articles')
                .icon(ComposeIcon)
                .child(() => getSectionsByYear({S, document: article, field: 'publishDate'})),

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
                          S.view.component(Iframe).options(iframeOptions).title('Draft View'),
                          S.view.component(ReferenceByTab).title('References'),
                        ]),
                    ),
                ),
              S.listItem()
                .title('Exceptional Works')
                .icon(DashboardIcon)
                .child(() => getSectionsByYear({S, document: exceptionalWork, field: 'startDate'})),
              S.listItem()
                .title('Exhibitions')
                .icon(DashboardIcon)
                .child(() => getSectionsByYear({S, document: exhibitionPage, field: 'startDate'})),
              S.listItem()
                .title('Fairs')
                .icon(DashboardIcon)
                .child(() => getSectionsByYear({S, document: fair, field: 'startDate'})),
              S.listItem()
                .title('Online Exhibitions')
                .icon(DashboardIcon)
                .child(() =>
                  getSectionsByYear({S, document: onlineExhibition, field: 'startDate'}),
                ),
            ]),
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
                        ]),
                    ),
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
                        ]),
                    ),
                ),
            ]),
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
                  S.view.component(Iframe).options(iframeOptions).title('Draft View'),
                  S.view.component(ReferenceByTab).title('References'),
                ]),
            ),
        ),
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
                .views([S.view.form(), S.view.component(ReferenceByTab).title('References')]),
            ),
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
                .views([S.view.form(), S.view.component(ReferenceByTab).title('References')]),
            ),
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
                .views([S.view.form(), S.view.component(ReferenceByTab).title('References')]),
            ),
        ),
      S.listItem()
        .title('Podcasts')
        .icon(ActivityIcon)
        .child(
          S.documentTypeList('podcast')
            .title('Podcasts')
            .defaultOrdering([{field: 'dateSelection', direction: 'asc'}]),
        ),
      S.listItem()
        .title('Videos')
        .icon(PlayIcon)
        .child(
          S.documentTypeList('video')
            .title('Videos')
            .defaultOrdering([{field: 'dateSelection', direction: 'asc'}]),
        ),

      S.listItem()
        .title('Curators')
        .icon(RobotIcon)
        .child(
          S.documentTypeList('curator')
            .title('Curators')
            .defaultOrdering([{field: 'name', direction: 'asc'}]),
        ),
    ])
