import {Path, SanityClient, SanityDocument} from 'sanity'
import {apiVersion} from '../../env'

export const getPropFromPath = (object: SanityDocument, path: Path) =>
  path.reduce((prev: any, curr) => {
    if (typeof curr === 'string' || typeof curr === 'number') return prev?.[curr]
    if ('_key' in curr)
      return (prev as Record<string, string>[])?.find((el) => el._key === curr._key)
    return null
  }, object)

export const getClientFromContext = (
  getClient: (options: {apiVersion: string}) => SanityClient
): SanityClient => getClient({apiVersion})
