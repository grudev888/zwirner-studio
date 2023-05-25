export const capitalize = (str: string): string => str.charAt(0) + str.slice(1)

export const slugify = (str: string): string =>
  str
    .trim()
    .replace(/[^\w]+/g, ' ')
    .replace(/\s+/g, '-')
    .toLowerCase()
