import {defineField} from 'sanity'

export type Address = {
  _type: 'dateRange'
  from: 'string'
  to: 'string'
}

export default defineField({
  name: 'address',
  title: 'Address',
  type: 'object',
  options: {columns: 2},
  fields: [
    defineField({
      name: 'addressLine',
      title: 'Address 1',
      type: 'string',
      validation: (rule) => [
        rule.required().min(5).error('An address of min. 5 characters is required'),
        rule.max(50).warning('Please, double check the length of this address'),
      ],
    }),
    defineField({
      name: 'addressLine2',
      title: 'Address 2',
      type: 'string',
      validation: (rule) => [
        rule.min(1).error('An address of min. 1 character is required'),
        rule.max(50).warning('Please, double check the length of this address'),
      ],
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
    }),
    defineField({
      name: 'state',
      title: 'Province/State',
      type: 'string',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
    }),
    defineField({
      name: 'zipCode',
      title: 'Zip Code',
      type: 'string',
    }),
    defineField({
      name: 'reverseZipAndCity',
      title: 'Reverse Zip Code and City',
      type: 'boolean',
    }),
    defineField({
      name: 'geoLocation',
      title: 'Geo-location',
      type: 'geopoint',
      // Todo: add google maps geo-point
      // https://www.sanity.io/docs/geopoint-type
    }),
  ],
})
