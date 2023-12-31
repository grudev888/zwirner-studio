import {type DocumentListBuilder, type ListBuilder, StructureBuilder} from 'sanity/desk'

import {apiVersion} from '../../../env'
import {ReferenceByTab} from '../../overrides/overrides'
import {getEndDateExhibitionsDate} from '../../../queries/exhibitionPage.queries'
import {getEndDateOnlineExhibitionsDate} from '../../../queries/onlineExhibition.queries'
import {getFairEndDate} from '../../../queries/fair.queries'
import {getExceptionalWorkEndDate} from '../../../queries/exceptionalWork.queries'
import {getArtistByName} from '../../../queries/artist.queries'
import exhibitionPage from '../../../schemas/documents/pages/exhibitionPage'
import onlineExhibition from '../../../schemas/documents/pages/onlineExhibitionPage'
import fair from '../../../schemas/documents/pages/fairPage'
import {capitalize} from '../../util/strings'
import {DocumentDefinition} from 'sanity'
import article from '../../../schemas/documents/article'
import {getArticleByDate} from '../../../queries/article.queries'
import artistPage from '../../../schemas/documents/pages/artistPage'
import exceptionalWork from '../../../schemas/documents/exceptionalWork'
import {Iframe} from 'sanity-plugin-iframe-pane'

import {iframeOptions} from '../../draftView/draftViewSettings'

interface StructureBuilderProps {
  S: StructureBuilder
  document: DocumentDefinition
  field?: string
}

const queryByType: any = {
  [exhibitionPage.name]: getEndDateExhibitionsDate,
  [onlineExhibition.name]: getEndDateOnlineExhibitionsDate,
  [fair.name]: getFairEndDate,
  [article.name]: getArticleByDate,
  [artistPage.name]: getArtistByName,
  [exceptionalWork.name]: getExceptionalWorkEndDate,
}

export async function getSectionsByYear({
  S,
  document,
  field = '_createdAt',
}: StructureBuilderProps): Promise<ListBuilder | DocumentListBuilder> {
  const name = document.name
  const title = document.title || capitalize(name)

  const defaultView = S.documentList()
    .title(`${title} Pages`)
    .filter(`_type == "${name}"`)
    .defaultOrdering([{field, direction: 'asc'}])

  const client = S.context.getClient({apiVersion})
  if (!client) return defaultView

  const docs = (await client.fetch(queryByType[name])) || []
  if (!docs?.length) return defaultView

  const years: Record<string, Array<string>> = {}

  docs.forEach(({_id, ...doc}: any) => {
    const date = doc[field]
    const dateFormatted = date ? new Date(date) : new Date()
    const year = dateFormatted.getFullYear().toString()

    if (!Array.isArray(years[year])) {
      years[year] = []
    }

    years[year].push(_id)
  })

  const includePreview = [S.view.component(Iframe).options(iframeOptions).title('Draft View')]

  return S.list()
    .title(`${title}s by Year`)
    .id('year')
    .items(
      Object.keys(years)
        .sort()
        .reverse()
        .map((year) =>
          S.listItem()
            .id(year)
            .title(year)
            .child(
              S.documentList()
                .schemaType(name)
                .title(`${title}s from ${year}`)
                .filter(`_id in $ids`)
                .params({ids: years[year]})
                .child((childId) =>
                  S.document()
                    .id(childId)
                    .schemaType(name)
                    .views([
                      S.view.form(),
                      ...includePreview,
                      S.view.component(ReferenceByTab).title('References'),
                    ]),
                ),
            ),
        ),
    )
}
