import groq from 'groq'

import {componentsByDataScheme} from './page.queries'
import {pageSEOFields} from './seo.queries'
import exhibitionPage from '../schemas/documents/pages/exhibitionPage'


const exhibitionDateFields = groq`
  _id,
  "date": endDate,
`

export const exhibitionSimpleFields = groq`
  _id,
  title,
  subtitle,
  description,
  summary,
  startDate,
  endDate,
`
export const exhibitionComplexFields = groq`
  "artists": artists[]->,
  "artworks": artworks[]->,
  "collections": collections[]->,
`

export const getEndDateExhibitionsDate = groq`
*[_type == "exhibitionPage"] {
  ${exhibitionDateFields}
}`

export const exhibitionPageSlugs = groq`
*[_type == "exhibitionPage" && defined(slug.current)][]{
  "params": { "slug": slug.current }
}`

export const exhibitionPageBySlug = groq`
*[_type == "exhibitionPage" && slug.current == $slug][0] {
  ...,
  "exhibition": exhibitionPage->,
  seo {
    ${pageSEOFields}
  },
  ${componentsByDataScheme}
}`






export const allExhibitions = groq`
*[_type == "${exhibitionPage.name}"] | order(date desc, _updatedAt desc) {
  ${exhibitionSimpleFields}
  ${exhibitionComplexFields}
}`

export const getExhibitionByDate = groq`
*[_type == "${exhibitionPage.name}"] {
  ${exhibitionDateFields}
}`

export const exhibitionById = groq`
*[_type == "${exhibitionPage.name}" && _id == $exhibitionId ] {
  ...
}`
