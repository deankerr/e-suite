import NextImage from 'next/image'

const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL!

type ImageIdProps = {
  id: string
} & Omit<React.ComponentProps<typeof NextImage>, 'src'>

export const ImageId = ({ id, ...props }: ImageIdProps) => {
  const url = new URL(`${convexSiteUrl}/image`)
  url.searchParams.set('storageId', id)
  
  return <NextImage src={url.toString()} {...props} />
}