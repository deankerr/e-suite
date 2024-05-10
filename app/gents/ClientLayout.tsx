'use client'

import { useUserEntities } from '@/app/gents/api'

type ClientLayoutProps = { props?: unknown }

export const ClientLayout = ({}: ClientLayoutProps) => {
  useUserEntities()
  return <div className="absolute left-1 top-1/2 bg-violetA-9 opacity-50">C</div>
}
