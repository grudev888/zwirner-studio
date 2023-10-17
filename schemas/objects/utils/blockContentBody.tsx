import {GreyFootNote, GreyFootNoteDecorator} from '../../../components/block/GreyFootnote'
import * as dzMedia from '../page/components/molecules/dzMedia'
import {ImageIcon} from '@sanity/icons'

export default [
  {
    type: 'block',
    name: 'block',
    marks: {
      decorators: [
        {title: 'Strong', value: 'strong'},
        {title: 'Emphasis', value: 'em'},
        {
          title: 'Grey Note',
          value: 'greyNote',
          icon: GreyFootNote,
          component: GreyFootNoteDecorator,
        },
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
    },
  },

  dzMedia.builder({
    name: 'bodyImage',
    icon: ImageIcon,
    title: 'Image',
  }),
]
