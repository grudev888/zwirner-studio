import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {availability} from 'sanity-plugin-availability'
import {visionTool} from '@sanity/vision'
import {schema} from './schemas'
import {dataset, projectId} from './env'
import {generalStructure} from './lib/desk/structure/structure'
import {defaultDocumentNode} from './lib/desk/document'

export default defineConfig({
  title: 'Zwirner Gallery Website',
  projectId,
  dataset,
  plugins: [
    deskTool({structure: generalStructure, defaultDocumentNode}),
    visionTool(),
    availability(),
  ],
  schema,
})
