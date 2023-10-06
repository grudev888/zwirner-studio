import groq from 'groq'

const onlineExhibitionDateFields = groq`
  _id,
  _createdAt,
  startDate,
  endDate,
`

export const getEndDateOnlineExhibitionsDate = groq`
*[_type == "onlineExhibitionPage"] {
  ${onlineExhibitionDateFields}
}`
