import externalLink from './linkExternal'
import internalLink from './linkInternal'

export default [
  {
    type: 'block',
    styles: [],
    lists: [],
    marks: {
      decorators: [
        {title: 'Strong', value: 'strong'},
        {title: 'Emphasis', value: 'em'},
        {title: 'Underline', value: 'underline'},
        {
          title: 'Sup',
          value: 'sup',
          blockEditor: {
            icon: () => (
              <div>
                x<sup>2</sup>
              </div>
            ),
            render: ({children}: any) => <sup>{children}</sup>,
          },
        },
        {
          title: 'Sub',
          value: 'sub',
          blockEditor: {
            icon: () => (
              <div>
                x<sub>2</sub>
              </div>
            ),
            render: ({children}: any) => <sub>{children}</sub>,
          },
        },
        {
          title: 'Strikethrough',
          value: 'strikethrough',
          blockEditor: {
            icon: () => (
              <div>
                <s>abc</s>
              </div>
            ),
            render: ({children}: any) => <s>{children}</s>,
          },
        },
      ],
      annotations: [externalLink, internalLink],
    },
  },
]
