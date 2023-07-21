import groq from 'groq'

const fairPageFields = groq`
  _id,
  title,
  "date": endDate
`

export const getEndDateFairPagesDate = groq`
*[_type == "fairPage"] {
  ${fairPageFields}
}`
