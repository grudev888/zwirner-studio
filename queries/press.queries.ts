import groq from 'groq'

const pressDateFields = groq`
  _id,
  "date": publishDate,
`

export const getPressByDate = groq`
*[_type == "press"] {
  ${pressDateFields}
}`
