import { getVendorModelListData } from '@/data/admin/vendor'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { PrePrint } from '../util/pre-print'
import { fetchVendorModelLists } from './admin.actions'
import { VendorModelDataControlsCard } from './VendorModelData.ControlsCard'

type VendorModelListsCardProps = {
  props?: any
} & React.ComponentProps<'div'>

export async function VendorModelDataCardGroup({ className }: VendorModelListsCardProps) {
  const data = await getVendorModelListData()

  return (
    <div className={cn('space-y-3 rounded-md border p-4', className)}>
      <h2 className="p-2 font-medium">VendorModelData</h2>
      <VendorModelDataControlsCard action={fetchVendorModelLists} />

      <div className="flex w-full flex-wrap gap-3">
        {data.length === 0 ? (
          <PrePrint title="No Data">There is no data to display.</PrePrint>
        ) : (
          data.map((d) => (
            <PrePrint
              key={d.id}
              title={d.vendorId}
              description={`${
                Array.isArray(d.data) ? d.data.length : '?'
              } items, retrieved ${formatDistanceToNow(d.retrievedAt, { addSuffix: true })}`}
              className="max-w-md"
            >
              {d.data as React.ReactNode}
            </PrePrint>
          ))
        )}
      </div>
    </div>
  )
}
