export const toTitle = (value: string) => {
  const str = value.replace(/([A-Z])/g, ' $1')
  return str.charAt(0).toUpperCase() + str.slice(1)
}
