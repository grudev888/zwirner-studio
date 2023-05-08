import groq from 'groq'

// Must follow RedirectSchema
export const redirects = groq`
*[_type=="redirect"] {
  _id,
  to,
  from
}
`
