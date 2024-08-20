export const getThreadPath = ({ slug, type = '' }: { type?: string; slug: string }) => {
  switch (type) {
    case 'chat':
      return `/chat/${slug}`
    case 'textToImage':
      return `/images/${slug}`
    default:
      return `/chat/${slug}`
  }
}
