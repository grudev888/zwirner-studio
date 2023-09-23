import {StringDefinition} from 'sanity'

export const franchiseList = ['Zwirner', 'Utopia', 'Exceptional Works']

export const structure = {
  name: 'franchiseBranding',
  type: 'string' as 'string',
  title: 'Franchise Branding',
  description: 'Select the franchise branding for this page.',
  options: {
    list: franchiseList,
    layout: 'dropdown' as 'dropdown',
  },
}

export const franchiseBrandingField = (params: {group: string}): StringDefinition => {
  return {
    ...structure,
    ...params,
  }
}
