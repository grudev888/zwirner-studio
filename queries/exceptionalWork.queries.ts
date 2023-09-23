import groq from 'groq'

const exceptionalWorksDateFields = groq`
  _id,
  _createdAt,
  startDate,
  endDate,
`

export const getExceptionalWorkEndDate = groq`
*[_type == "exceptionalWork"] {
  ${exceptionalWorksDateFields}
}`
