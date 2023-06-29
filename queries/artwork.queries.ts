import groq from 'groq'
import artworkType from '../schemas/documents/artwork'

export const artworkById = groq`
*[_type == "${artworkType.name}" && _id == $artworkId ] {
  ...
}`
