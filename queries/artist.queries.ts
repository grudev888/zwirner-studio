import groq from 'groq'

export const artistById = groq`
*[_type == "artist" && _id == $artistId ] {
  ...
}`

export const artistPageWithSurvey = groq`
*[_type == "artistPage" && defined(surveySeries) && (references($id)) ][0] {
 'artistPageSlug': slug.current
}`

export const getArtistByName = groq`
*[_type == "artist" && _name == $lastName ] {
  ...
}`
