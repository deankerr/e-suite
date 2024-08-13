'use client'

import { usePathname, useRouter } from 'next/navigation'

import { SelectList } from '@/components/ui/SelectList'

const routes = [
  { path: '/admin', label: 'Dashboard' },
  { path: '/admin/chat-models', label: 'chat models' },
  { path: '/admin/image-models', label: 'image models' },
  { path: '/admin/voice-models', label: 'voice models' },
  { path: '/admin/images', label: 'images' },
  { path: '/admin/image-data', label: 'image data' },
]

export const AdminNav = () => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <SelectList
      items={routes.map((r) => ({ value: r.path, label: r.label }))}
      placeholder="Select a page"
      defaultValue={pathname}
      onValueChange={(path) => router.push(path)}
    />
  )
}
