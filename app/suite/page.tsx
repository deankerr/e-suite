import { Heading } from '@radix-ui/themes'

import { appConfig } from '@/config/config'

export default function Page() {
  return (
    <div className="h-full w-full p-4">
      <Heading>{appConfig.siteTitle}</Heading>
    </div>
  )
}
