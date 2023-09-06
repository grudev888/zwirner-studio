export const apiVersion = process.env.SANITY_STUDIO_SANITY_API_VERSION || '2023-01-01'

export const envHost = `http${
  ['production', 'preview'].includes(process.env.SANITY_STUDIO_VERCEL_ENV || '') ? 's' : ''
}://${process.env.SANITY_STUDIO_VERCEL_URL}`

export const projectId = assertValue(
  process.env.SANITY_STUDIO_PROJECT_ID,
  'Missing environment variable: SANITY_STUDIO_PROJECT_ID'
)

export const dataset = assertValue(
  process.env.SANITY_STUDIO_TEST_DATABASE,
  'Missing environment variable: SANITY_STUDIO_TEST_DATABASE'
)

export const shopifyStoreId = assertValue(
  process.env.SANITY_STUDIO_SHOPIFY_ID,
  'Missing environment variable: SANITY_STUDIO_SHOPIFY_ID'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
