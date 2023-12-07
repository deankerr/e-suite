import { AdminPage } from '@/components/admin/AdminPage'
import { PrePrint } from '@/components/util/pre-print'
import { getVendorModelListData } from '@/data/admin/resource.dal'
import { getServerSession } from '@/data/auth'
import { redirect } from 'next/navigation'

export default async function Page() {
  return <AdminPage />
}
