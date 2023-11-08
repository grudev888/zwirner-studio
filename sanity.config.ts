import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {availability} from 'sanity-plugin-availability'
import {visionTool} from '@sanity/vision'
import {schemaTypes, singletonDocuments, shopifyDocuments} from './schemas'
import {dataset, projectId, SANITY_STUDIO_PREVIEW_BASE_URL, previewSecretId} from './env'
import {generalStructure} from './lib/desk/structure/structure'
import {defaultDocumentNode} from './lib/desk/document'
import {media, mediaAssetSource} from 'sanity-plugin-media'
import {scheduledPublishing, ScheduleAction} from '@sanity/scheduled-publishing'
import {customPublishConfirm} from './components/actions/customPublishConfirm'
import {previewUrl} from 'sanity-plugin-iframe-pane/preview-url'
import {
  PREVIEWABLE_DOCUMENT_TYPES,
  PREVIEWABLE_DOCUMENT_TYPES_REQUIRING_SLUGS,
} from './lib/draftView/draftViewSettings'

const singletonActions = new Set<string>(['publish', 'discardChanges', 'restore'])

const templateFilterTypes = [
  ...singletonDocuments,
  ...shopifyDocuments,
  {
    name: 'media.tag',
  },
]

export default defineConfig({
  title: 'Zwirner Gallery Website',
  projectId,
  dataset,
  plugins: [
    deskTool({structure: generalStructure, defaultDocumentNode}),
    scheduledPublishing(),
    media(),
    visionTool(),
    availability(),
    // Add the "Open preview" action
    previewUrl({
      base: SANITY_STUDIO_PREVIEW_BASE_URL,
      requiresSlug: PREVIEWABLE_DOCUMENT_TYPES_REQUIRING_SLUGS,
      urlSecretId: previewSecretId,
      matchTypes: PREVIEWABLE_DOCUMENT_TYPES,
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => {
      const filteredTemplates = templates.filter(
        (template) => !templateFilterTypes.some((doc) => template.schemaType === doc.name),
      )
      return filteredTemplates
    },
  },
  document: {
    actions: (actions, context) => {
      // Replace publish with custom publish action that contains confirmation dialogue
      const newActions = actions.map((originalAction) => {
        if (originalAction.action === 'publish') {
          return customPublishConfirm(originalAction)
        }
        return originalAction
      })
      // remove actions form singleton documents, include schedule action
      if (singletonDocuments.some((doc) => doc.name === context.schemaType)) {
        const filteredActions = newActions.filter(
          ({action}) => action && singletonActions.has(action),
        )
        filteredActions.push(ScheduleAction)
        return filteredActions
      }

      // remove actions form shopify documents
      if (shopifyDocuments.some((doc) => doc.name === context.schemaType)) {
        const filteredActions = newActions.filter(
          ({action}) => action && singletonActions.has(action),
        )
        return filteredActions
      }
      return newActions
    },
  },
  form: {
    file: {
      assetSources: () => [mediaAssetSource],
      directUploads: true,
    },
    image: {
      assetSources: () => [mediaAssetSource],
      directUploads: true,
    },
    video: {
      assetSources: () => [mediaAssetSource],
      directUploads: true,
    },
  },
})
