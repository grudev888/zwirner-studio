import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {availability} from 'sanity-plugin-availability'
import {visionTool} from '@sanity/vision'
import {schemaTypes, singletonDocuments, shopifyDocuments} from './schemas'
import {dataset, projectId} from './env'
import {generalStructure} from './lib/desk/structure/structure'
import {defaultDocumentNode} from './lib/desk/document'
import {media, mediaAssetSource} from 'sanity-plugin-media'

const singletonActions = new Set<string>(["publish", "discardChanges", "restore"])

const templateFilterTypes = [
  ...singletonDocuments,
  ...shopifyDocuments,
  {
    name: "media.tag"
  }
]

const actionFilterTypes = [
  ...singletonDocuments,
  ...shopifyDocuments,
]

export default defineConfig({
  title: 'Zwirner Gallery Website',
  projectId,
  dataset,
  plugins: [
    deskTool({structure: generalStructure, defaultDocumentNode}),
    media(),
    visionTool(),
    availability(),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => {
      const filteredTemplates = templates.filter((template) => 
        !templateFilterTypes.some((singletonDoc) => template.schemaType === singletonDoc.name))
      return filteredTemplates;
    }
  },
  document: {
    actions: (input, context) => 
      actionFilterTypes.some((singletonDoc) => singletonDoc.name === context.schemaType)
      ? input.filter(({ action }) => action && singletonActions.has(action))
      : input,
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
