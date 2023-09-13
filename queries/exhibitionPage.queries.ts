import groq from 'groq'

const exhibitionDateFields = groq`
  _id,
  "date": endDate,
`

export const getEndDateExhibitionsDate = groq`
*[_type == "exhibitionPage"] {
  ${exhibitionDateFields}
}`
