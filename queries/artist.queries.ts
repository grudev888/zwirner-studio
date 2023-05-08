import groq from 'groq'

export const artistById = groq`
*[_type == "artist" && _id == $artistId ] {
  ...
}`

