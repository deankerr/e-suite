'use client'

import { Badge } from '@radix-ui/themes'
import { accentColors } from '@radix-ui/themes/props'

import { AdminPageWrapper } from '@/app/admin/AdminPageWrapper'

export default function Page() {
  return (
    <AdminPageWrapper>
      <div className="flex h-full flex-wrap gap-2 bg-grayA-2">
        {accentColors.map((color) => (
          <Badge key={color} size="3" color={color}>
            {color}
          </Badge>
        ))}
      </div>
    </AdminPageWrapper>
  )
}
