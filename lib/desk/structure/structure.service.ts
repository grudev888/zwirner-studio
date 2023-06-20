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
import {capitalize} from '../../util/strings'
import {DocumentDefinition} from 'sanity'
import article from '../../../schemas/documents/article'
import {getArticleByDate} from '../../../queries/article.queries'

interface StructureBuilderProps {
  S: StructureBuilder
  document: DocumentDefinition
  preview?: PreviewProps
}
interface PreviewProps {
  section: 'exhibitions' | 'fairs' | 'artists' | 'news'
}

const queryByType: any = {
  [exhibitionPage.name]: getEndDateExhibitionsDate,
  [fairPage.name]: getEndDateFairPagesDate,
  [press.name]: getPressByDate,
  [exhibition.name]: getExhibitionByDate,
  [article.name]: getArticleByDate,
}
export async function getSectionsByYear({
  S,
  document,
  preview,
}: StructureBuilderProps): Promise<ListBuilder | DocumentListBuilder> {
  const name = document.name
  const title = document.title || capitalize(name)

  const defaultView = S.documentList()
    .title(`${title} Pages Posted`)
    .filter(`_type == "${name}"`)
    .defaultOrdering([{field: 'publishedAt', direction: 'asc'}])

  const client = S.context.getClient({apiVersion})

  if (!client) {
    return S.documentList()
      .title(`${title} Pages Posted`)
      .filter(`_type == "${name}"`)
      .defaultOrdering([{field: 'publishedAt', direction: 'asc'}])
  }

  const docs = (await client.fetch(queryByType[name])) || []
  if (!docs.length) return defaultView

  const years: Record<string, Array<string>> = {}

  docs.forEach(({date, _id}: any) => {
    const dateFormatted = date ? new Date(date) : new Date()
    const year = dateFormatted.getFullYear().toString()

    if (!Array.isArray(years[year])) {
      years[year] = []
    }

    years[year].push(_id)
  })

  const includePreview = preview
    ? [
        S.view
          .component(PreviewIframe)
          .options({
            url: (doc: any) => {
              const currentSlug = doc?.slug?.current
              const slugToUse = currentSlug?.startsWith('/')
                ? currentSlug.substring(1)
                : currentSlug
              return `${envHost}/api/sanity/preview?slug=${slugToUse}&section=${preview.section}`
            },
          })
          .title('Preview'),
      ]
    : []

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
                    ])
                )
            )
        )
    )
}
