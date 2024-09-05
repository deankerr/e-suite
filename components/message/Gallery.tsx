import { useParams } from 'next/navigation'

import type { EMessage } from '@/convex/types'

export const Gallery = ({ message, priority }: { message: EMessage; priority?: boolean }) => {
  const params = useParams()
  const slug = params.thread_id as string

  // if (message.images.length === 0) return null
  // return (
  //   <div className="flex grow flex-wrap gap-2 py-1">
  //     {message.images.map((image) => (
  //       <Link href={`/images/${slug}/${image.id}`} key={image._id}>
  //         <IImageCard
  //           image={image}
  //           sizes="(max-width: 410px) 20rem"
  //           priority={priority}
  //           className="h-72 w-auto [&>img]:object-cover"
  //         />
  //       </Link>
  //     ))}
  //   </div>
  // )
}
