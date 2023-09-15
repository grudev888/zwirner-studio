import groq from 'groq'

const exhibitionDateFields = groq`
  _id,
  _createdAt,
  startDate,
  endDate,
`

export const getEndDateExhibitionsDate = groq`
*[_type == "exhibitionPage"] {
  ${exhibitionDateFields}
}`
