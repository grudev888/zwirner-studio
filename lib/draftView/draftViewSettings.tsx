import {SANITY_STUDIO_PREVIEW_BASE_URL, envHost} from '../../env'

import {type IframeOptions} from 'sanity-plugin-iframe-pane'

export const iframeOptions = {
  url: {
    origin: `${envHost}`, // or 'same-origin' if the app and studio are on the same origin
    preview: (document) => {
      if (document?._type === 'home') {
        return '/'
      }
      return document?.slug?.current
    },
    draftMode: `${SANITY_STUDIO_PREVIEW_BASE_URL}`, // the route you enable draft mode, see: https://github.com/sanity-io/visual-editing/tree/main/packages/preview-url-secret#sanitypreview-url-secret
  },
  // Optional: Display the Url in the pane
  showDisplayUrl: true, // boolean. default `true`.

  // Optional: Set the default size
  defaultSize: `desktop`, // default `desktop`, optionally `mobile`

  // Optional: Add a reload button
  reload: {
    button: true, // default `undefined`
  },
} satisfies IframeOptions
