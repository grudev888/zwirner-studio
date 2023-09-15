import groq from 'groq'

import article from '../schemas/documents/article'

const articleDateFields = groq`
  _id,
  _createdAt,
  publishDate,
`

export const getArticleByDate = groq`
*[_type == "${article.name}"] {
  ${articleDateFields}
}`
