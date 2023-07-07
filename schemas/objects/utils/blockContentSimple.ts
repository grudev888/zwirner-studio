import externalLink from './linkExternal'
import internalLink from './linkInternal'

export default [
      {
        type: 'block',
        styles: [],
        lists: [],
          marks: {
            decorators: [
                {title: 'Emphasis', value: 'em'},
                {title: 'Underline', value: 'underline'},
              ],
            annotations: [
                 externalLink,
                 internalLink,
            ],
          },
        }
      ]