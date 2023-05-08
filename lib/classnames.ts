export const cn = (...args: string[]) => {
  return args.join(' ').replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, ' ').trim();
}