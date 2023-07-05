import {ResolveProductionUrlContext} from 'sanity'
import {DefaultDocumentNodeContext, StructureBuilder, View, ViewBuilder} from 'sanity/desk'
import {SanityDocument, SchemaType} from 'sanity'

export type StructureViewsResolver = (
  S: StructureBuilder,
  ctx: DefaultDocumentNodeContext
) => Array<View | ViewBuilder>

export type DocumentURLResolver = (
  ctx: ResolveProductionUrlContext
) => Promise<string | null | undefined>

export interface UserViewProps {
  document: {
    draft: SanityDocument | null
    displayed: Partial<SanityDocument>
    historical: Partial<SanityDocument> | null
    published: SanityDocument | null
  }
  documentId: string
  options: Record<string, any>
  schemaType: SchemaType
}

declare module 'sanity' {
  export interface DocumentOptions {
    views?: StructureViewsResolver
    url?: DocumentURLResolver
  }
}
