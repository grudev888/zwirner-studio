export const apiVersion = process.env.SANITY_STUDIO_SANITY_API_VERSION || '2023-01-01'

export const envHost = `http${
  ['production', 'preview'].includes(process.env.SANITY_STUDIO_VERCEL_ENV || '') ? 's' : ''
}://${process.env.SANITY_STUDIO_VERCEL_URL}`

// Used to generate URLs for previewing your content
export const SANITY_STUDIO_PREVIEW_BASE_URL =
  process.env.SANITY_STUDIO_PREVIEW_BASE_URL || '/api/draft'

// This is the document id used for the preview secret that's stored in your dataset.
// The secret protects against unauthorized access to your draft content and have a lifetime of 60 minutes, to protect against bruteforcing.
export const previewSecretId: `${string}.${string}` = 'preview.secret'

export const projectId = assertValue(
  process.env.SANITY_STUDIO_PROJECT_ID,
  'Missing environment variable: SANITY_STUDIO_PROJECT_ID',
)

export const dataset = assertValue(
  process.env.SANITY_STUDIO_TEST_DATABASE,
  'Missing environment variable: SANITY_STUDIO_TEST_DATABASE',
)

export const shopifyStoreId = assertValue(
  process.env.SANITY_STUDIO_SHOPIFY_ID,
  'Missing environment variable: SANITY_STUDIO_SHOPIFY_ID',
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
