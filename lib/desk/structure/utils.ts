import {envHost, PREVIEW_BASE_URL} from '../../../env'

export const getPreviewUrl = (doc: any) => {
  const slug = doc?.slug?.current

  const query = new URLSearchParams()

  if (slug) {
    query.set('path', slug?.replace(/^\//, '').split('/').join(','))
  }

  return `${envHost}${PREVIEW_BASE_URL}?${query.toString()}`
}

export const getSingletonPreviewUrl = (relativePath: string) => {
  if (!relativePath) throw new Error('Relative path needed to generate the preview url')

  const query = new URLSearchParams()

  query.set('path', relativePath?.replace(/^\//, '').split('/').join(','))

  return `${envHost}${PREVIEW_BASE_URL}?${query.toString()}`
}
