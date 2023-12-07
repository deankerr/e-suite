import { getServerSession } from '@/data/auth'
import { cn } from '@/lib/utils'
import { huggingfacePlugin } from '@/plugins/huggingface.plugin'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { Loading } from '../ui/loading'
import { VendorModelDataCardGroup } from './VendorModelData.CardGroup'

type AdminPageProps = {
  props?: any
} & React.ComponentProps<'div'>

export async function AdminPage({ className }: AdminPageProps) {
  const session = await getServerSession()
  huggingfacePlugin.models
  if (!session || !session.isAdmin) {
    redirect('/')
  }

  return (
    <div className={cn('space-y-4 p-4', className)}>
      <h1 className="p-3 text-lg font-medium">AdminPage</h1>
      <Suspense fallback={<Loading size="lg" />}>
        <VendorModelDataCardGroup />
      </Suspense>
    </div>
  )
}
