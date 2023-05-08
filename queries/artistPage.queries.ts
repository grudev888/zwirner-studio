import groq from 'groq'

import {componentsByDataScheme} from './page.queries'
import {pageSEOFields} from './seo.queries'

export const artistPageSlugs = groq`
*[_type == "artistPage" && defined(slug.current)][]{
  "params": { "slug": slug.current }
}`

export const artistPageBySlug = groq`
*[_type == "artistPage" && slug.current == $slug][0] {
  _id,
  title,
  "artist": artist->,
  ${componentsByDataScheme}
  seo {
    ${pageSEOFields}
  },
  slug,
}`
