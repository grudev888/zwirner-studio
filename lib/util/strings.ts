export const capitalize = (str: string): string => str.charAt(0) + str.slice(1)

export const slugify = (str: string): string =>
  str
    .trim()
    .replace(/[^\w]+/g, ' ')
    .replace(/\s+/g, '-')
    .toLowerCase()

export const randomIntString = (length = 5) => {
  return Math.floor(
    Number(String(1).padEnd(length, '0')) +
    Math.random() *  Math.floor(Number(String(9).padEnd(length, '0')))
  )
}
