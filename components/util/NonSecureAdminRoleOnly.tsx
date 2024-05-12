'use client'

import { useUser } from '@clerk/nextjs'

export const NonSecureAdminRoleOnly = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useUser()
  const isAdmin = user?.publicMetadata.role === 'admin'

  return isAdmin ? children : null
}
