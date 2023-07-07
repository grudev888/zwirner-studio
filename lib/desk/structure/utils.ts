import {envHost} from '../../../env'

export const getPreviewUrl = (doc: any) => {
  const slug = doc?.slug?.current

  const query = new URLSearchParams()

  if (slug) {
    query.set('path', slug?.replace(/^\//, '').split('/').join(','))
  }

  return `${envHost}/api/sanity/preview?${query.toString()}`
}
