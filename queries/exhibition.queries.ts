import groq from 'groq'

import exhibitionPage from '../schemas/documents/pages/exhibitionPage'

export const exhibitionSimpleFields = groq`
  _id,
  title,
  subtitle,
  description,
  summary,
  startDate,
  endDate,
`

const exhibitionDateFields = groq`
  _id,
  "date": endDate,
`

export const exhibitionComplexFields = groq`
  "artists": artists[]->,
  "artworks": artworks[]->,
  "collections": collections[]->,
`

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
