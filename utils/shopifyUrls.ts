import { shopifyStoreId } from "../env"

export const collectionUrl = (collectionId: number) => {
  if (!shopifyStoreId) {
    return null
  }
  return `https://${shopifyStoreId}/admin/collections/${collectionId}`
}

export const productUrl = (productId: number) => {
  if (!shopifyStoreId) {
    return null
  }
  return `https://${shopifyStoreId}/admin/products/${productId}`
}

export const productVariantUrl = (productId: number, productVariantId: number) => {
  if (!shopifyStoreId) {
    return null
  }
  return `https://${shopifyStoreId}/admin/products/${productId}/variants/${productVariantId}`
}
