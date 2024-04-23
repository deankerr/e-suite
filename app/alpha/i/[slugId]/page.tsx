import { ImagePage } from './ImagePage'

export const metadata = {
  title: 'Image',
}

export default function ImageSlugIdPage({ params: { slugId } }: { params: { slugId: string } }) {
  return <ImagePage slugId={slugId} />
}
