import {type DocumentListBuilder, type ListBuilder, StructureBuilder} from 'sanity/desk'

import {apiVersion, envHost} from '../../../env'
import {ReferenceByTab} from '../../overrides/overrides'
import {PreviewIframe} from '../../preview/customIframe/previewIframe'
import {getExhibitionByDate} from '../../../queries/exhibition.queries'
import {getEndDateExhibitionsDate} from '../../../queries/exhibitionPage.queries'
import {getEndDateFairPagesDate} from '../../../queries/fairPage.queries'
import {getPressByDate} from '../../../queries/press.queries'
import exhibition from '../../../schemas/documents/exhibition'
import exhibitionPage from '../../../schemas/documents/pages/exhibitionPage'
import fairPage from '../../../schemas/documents/pages/fairPage'
import press from '../../../schemas/documents/press'

interface StructureBuilderProps {
  S: StructureBuilder
  sectionTitle: string
  type: string
  preview?: PreviewProps
}
interface PreviewProps {
  section: 'exhibitions' | 'fairs' | 'artists'
}

const queryByType: any = {
  [exhibitionPage.name]: getEndDateExhibitionsDate,
  [fairPage.name]: getEndDateFairPagesDate,
  [press.name]: getPressByDate,
  [exhibition.name]: getExhibitionByDate,
}
export async function getSectionsByYear({
  S,
  sectionTitle,
  type,
  preview,
}: StructureBuilderProps): Promise<ListBuilder | DocumentListBuilder> {
  const defaultView = S.documentList()
    .title(`${sectionTitle} Pages Posted`)
    .filter(`_type == "${type}"`)
    .defaultOrdering([{field: 'publishedAt', direction: 'asc'}])
  const {context} = S
  const client = context.getClient({apiVersion})
  if (!client) {
    return S.documentList()
      .title(`${sectionTitle} Pages Posted`)
      .filter(`_type == "${type}"`)
      .defaultOrdering([{field: 'publishedAt', direction: 'asc'}])
  }

  const docs = (await client.fetch(queryByType[type])) || []
  const years: any = {}

  docs.forEach(({date, _id}: any) => {
    const dateFormatted = date ? new Date(date) : new Date()
    const year = dateFormatted.getFullYear()
    if (!years[year]) {
      years[year] = []
    }
    years[year].push(_id)
  })

  if (!docs.length) {
    return defaultView
  }

  const includePreview = preview
    ? [
        S.view
          .component(PreviewIframe)
          .options({
            url: (doc: any) => {
              return `${envHost}/api/sanity/preview?slug=${doc?.slug?.current}&section=${preview.section}`
            },
          })
          .title('Preview'),
      ]
    : []

  return S.list()
    .title(`${sectionTitle} by year`)
    .id('year')
    .items(
      Object.keys(years).map((year) => {
        return S.listItem()
          .id(year)
          .title(year)
          .child(
            S.documentList()
              .schemaType(type)
              .title(`${sectionTitle} from ${year}`)
              .filter(`_id in $ids`)
              .params({ids: years[year]})
              .child((childId) =>
                S.document()
                  .id(childId)
                  .schemaType(type)
                  .views([
                    S.view.form(),
                    ...includePreview,
                    S.view.component(ReferenceByTab).title('References'),
                  ])
              )
          )
      })
    )
}
