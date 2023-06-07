import {Path, SanityDocument} from 'sanity'

export const getPropFromPath = (object: SanityDocument, path: Path) =>
  path.reduce((prev: any, curr) => {
    if (typeof curr === 'string' || typeof curr === 'number') return prev?.[curr]
    if ('_key' in curr)
      return (prev as Record<string, string>[])?.find((el) => el._key === curr._key)
    return null
  }, object)
