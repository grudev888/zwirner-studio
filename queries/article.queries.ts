import groq from 'groq'

import article from '../schemas/documents/article'

const articleDateFields = groq`
  _id,
  date,
`

export const getArticleByDate = groq`
*[_type == "${article.name}"] {
  ${articleDateFields}
}`
