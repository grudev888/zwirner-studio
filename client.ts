import {useMemo} from 'react'
import {useClient} from 'sanity'

import {apiVersion, dataset, projectId} from './env'

const config = {
  apiVersion,
  dataset,
  projectId,
  useCdn: false,
}

export function useSanityClient() {
  const client = useClient(config)
  return useMemo(() => client.withConfig(config), [client])
}
