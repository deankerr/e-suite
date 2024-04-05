'use client'

import { useState } from 'react'
import { Button, Card } from '@radix-ui/themes'

import { StaticImage } from '@/components/ui/StaticImage'
import { Ent } from '@/convex/types'

export default function StaticPage() {
  // StaticPage
  const image = sampleImage as Ent<'images'>
  const loadingImage = sampleLoadingImage as Ent<'images'>
  const [loadKey, setLoadKey] = useState(4)
  return (
    <div className="flex-center w-full p-10">
      <Card className="h-[1000px] w-[1200px] p-8">
        <Button onClick={() => setLoadKey(Date.now())}>key</Button>
        <div className="flex-between">
          <StaticImage alt="" image={image} />
          <StaticImage alt="" image={loadingImage} key={loadKey} />
        </div>
      </Card>
    </div>
  )
}

const sampleImage = {
  _creationTime: 1712351261480.5688,
  _id: 'nn70ngm5j0px9sec9nem9h5wfs6pmc8f',
  blurDataURL:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAM0lEQVR4nAEoANf/AB0NEsWvqxojMwAABB+FhZCQkZ0AqpSJ/8qb0MviAItcO6KFc+P6/yy5Eoc0CZyFAAAAAElFTkSuQmCC',
  color: '#080808',
  jobId: '3ft19y40pbmz0tkk0hb7x2cx9nnbht8',
  sourceUrl: 'https://illustration-generated.s3.us-west-1.amazonaws.com/1712351263_8852_56313.png',
  storageId: '3g1a0bay01yppwvxyt17h37v9nn4ypr',
  storageUrl:
    'https://artful-husky-972.convex.cloud/api/storage/8cdd19f4-143d-498c-be13-f88a1dc2365e',
  height: 768,
  width: 512,
}

const sampleLoadingImage = {
  _creationTime: 1712351261480.5688,
  _id: 'nn70ngm5j0px9sec9nem9h5wfs6pmc8f',
  height: 768,
  width: 512,
  jobId: '3ft19y40pbmz0tkk0hb7x2cx9nnbht8',
}
