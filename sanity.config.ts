import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {availability} from 'sanity-plugin-availability'
import {visionTool} from '@sanity/vision'
import {schema} from './schemas'
import {dataset, projectId} from './env'
import {generalStructure} from './lib/desk/structure/structure'
import {defaultDocumentNode} from './lib/desk/document'
import {media, mediaAssetSource} from 'sanity-plugin-media'

export default defineConfig({
  title: 'Zwirner Gallery Website',
  projectId,
  dataset,
  plugins: [
    deskTool({structure: generalStructure, defaultDocumentNode}),
    media(),
    visionTool(),
    availability()
  ],
  schema,
  form: {
    // Don't use this plugin when selecting files only (but allow all other enabled asset sources)
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
      }
  }
})