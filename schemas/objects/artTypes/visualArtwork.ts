import {defineField, defineType} from 'sanity'
export default defineType({
  name: 'visualArtWork',
  title: 'Visual Artwork',
  type: 'object',
  fields: [
    defineField({
      name: 'artEdition',
      title: 'artEdition',
      type: 'number',
      description:
        'The number of copies when multiple copies of a piece of artwork are produced - e.g. for a limited edition of 20 prints, \'artEdition\' refers to the total number of copies (in this example "20").',
    }),
  ],
})
