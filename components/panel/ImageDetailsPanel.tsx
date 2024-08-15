'use client'

import { EmptyPage } from '@/components/pages/EmptyPage'
import { ImageDetailsPage } from '@/components/pages/ImageDetailsPage'
import { LoadingPage } from '@/components/pages/LoadingPage'
import { Panel } from '@/components/panel/Panel'
import { useImage } from '@/lib/api'

export const ImageDetailsPanel = (props: { imageUid: string }) => {
  const image = useImage(props.imageUid)

  if (image === null) {
    return (
      <Panel>
        <EmptyPage />
      </Panel>
    )
  }

  if (image === undefined) {
    return (
      <Panel>
        <LoadingPage />
      </Panel>
    )
  }

  return (
    <Panel>
      <Panel.Content>
        <ImageDetailsPage image={image} />
      </Panel.Content>
    </Panel>
  )
}
