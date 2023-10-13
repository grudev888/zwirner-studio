import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {availability} from 'sanity-plugin-availability'
import {visionTool} from '@sanity/vision'
import {schemaTypes, singletonDocuments, shopifyDocuments} from './schemas'
import {dataset, projectId} from './env'
import {generalStructure} from './lib/desk/structure/structure'
import {defaultDocumentNode} from './lib/desk/document'
import {media, mediaAssetSource} from 'sanity-plugin-media'
import { scheduledPublishing, ScheduleAction } from '@sanity/scheduled-publishing'

const singletonActions = new Set<string>(["publish", "discardChanges", "restore"])

const templateFilterTypes = [
  ...singletonDocuments,
  ...shopifyDocuments,
  {
    name: "media.tag"
  }
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
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => {
      const filteredTemplates = templates.filter((template) => 
        !templateFilterTypes.some((doc) => template.schemaType === doc.name))
      return filteredTemplates;
    }
  },
  document: {
    actions: (actions, context) => {
      if (singletonDocuments.some((doc) => doc.name === context.schemaType)) {
        const filteredActions = actions.filter(({ action }) => action && singletonActions.has(action))
        filteredActions.push(ScheduleAction)
        return filteredActions
      }
      if (shopifyDocuments.some((doc) => doc.name === context.schemaType)) {
        const filteredActions = actions.filter(({ action }) => action && singletonActions.has(action))
        return filteredActions
      }
      return actions
    }
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
