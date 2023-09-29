import groq from 'groq'

const fairDateFields = groq`
  _id,
  _createdAt,
  startDate,
  endDate,
`

export const getFairEndDate = groq`
*[_type == "fair"] {
  ${fairDateFields}
}`
