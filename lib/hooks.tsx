import { useDocumentTitle } from '@uidotdev/usehooks'

export const useTitle = (subtitle?: string) => {
  useDocumentTitle(`e/suite${subtitle ? ` / ${subtitle}` : ''}`)
}
