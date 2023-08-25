import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'dateSelectionYear',
  type: 'object',
  title: 'Date Selection',
  description: 'Select a year',
  fields: [
    defineField({
      name: 'year',
      type: 'string',
      title: 'Year',
      description: 'Add a single year in the format: YYYY.',
      hidden: ({parent, value}) => {
        return !!(!value && (parent?.dateRange?.from || parent?.approximate))
      },
    }),
  ],
})
