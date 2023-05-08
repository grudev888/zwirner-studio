import groq from 'groq'

import {redirects} from './redirects.queries'
import {generalSEO} from './seo.queries'

export const generalSettings = groq`{
  'globalSEO': ${generalSEO},
  'redirects': ${redirects}
}
`
