import {defineField, defineType} from 'sanity'

import dateRange from './dateRange'

export default defineType({
  name: 'dateSelection',
  type: 'object',
  title: 'Date Selection',
  description: 'Select a year, approximate date, or a date range',
  fields: [
    defineField({
      name: 'year',
      type: 'string',
      title: 'Year',
      description: 'Single year. Format: YYYY',
      hidden: ({parent, value}) => {
        return !!(!value && (parent?.dateRange?.from || parent?.approximate))
      },
    }),
    defineField({
      name: 'approximate',
      type: 'string',
      title: 'Approximate date',
      description: 'Single date. Accepts formats like "Month YYYY" or "YYYY-MM-DD". Not for any date ranges',
      hidden: ({parent, value}) => {
        return !!(!value && (parent?.dateRange?.from || parent?.year))
      },
    }),
    defineField({
      name: 'dateRange',
      type: dateRange.name,
      title: 'Date Range',
      description: 'Select a date range.',
      hidden: ({parent, value}) => {
        return !!(!value?.from && (parent?.year || parent?.approximate))
      },
    }),
  ],
})
