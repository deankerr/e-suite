import { getVendorModelListData } from '@/data/admin/resource.dal'
import { db } from '@/lib/drizzle'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { PrePrint } from '../util/pre-print'
import { buildResourceRecords, fetchVendorModelLists } from './admin.actions'
import { VendorModelDataControlsCard } from './VendorModelData.ControlsCard'

type VendorModelListsCardProps = {
  props?: any
} & React.ComponentProps<'div'>

export async function VendorModelDataCardGroup({ className }: VendorModelListsCardProps) {
  const data = await getVendorModelListData()

  const data0 = data[0]?.data as Record<string, string>[]
  const list0 =
    '_id' in data0[0]! ? data0.map((v) => v.name?.toLowerCase()) : data0.map((v) => v.id)

  const data1 = data[1]?.data as Record<string, string>[]
  const list1 =
    '_id' in data1[1]! ? data1.map((v) => v.name?.toLowerCase()) : data1.map((v) => v.id)

  const list2 = [
    'openai/gpt-3.5-turbo',
    'openai/gpt-3.5-turbo-instruct',
    'openai/gpt-3.5-turbo-instruct-0914',
    'openai/gpt-3.5-turbo-0301',
    'openai/gpt-3.5-turbo-0613',
    'openai/gpt-3.5-turbo-1106',
    'openai/gpt-3.5-turbo-16k',
    'openai/gpt-3.5-turbo-16k-0613',
    'openai/gpt-4',
    'openai/gpt-4-0314',
    'openai/gpt-4-0613',
    'openai/gpt-4-1106-preview',
    'openai/gpt-4-vision-preview',
  ]

  const allModels = [...list0, ...list1, ...list2].sort()

  return (
    <div className={cn('space-y-3 rounded-md border p-4', className)}>
      <h2 className="p-2 font-medium">VendorModelData</h2>
      <VendorModelDataControlsCard
        fetchRemoteAction={fetchVendorModelLists}
        buildResourcesAction={buildResourceRecords}
      />
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
        <PrePrint title="ids">{allModels}</PrePrint>
      </div>
    </div>
  )
}
