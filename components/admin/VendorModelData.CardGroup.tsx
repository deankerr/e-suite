import { createAdminDao } from '@/data/admin'
import { getLatestModelListDataForVendorId } from '@/data/admin/vendor-model-data'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { PrePrint } from '../util/pre-print'
import { buildModels, buildResourceRecords, fetchVendorModelLists } from './admin.actions'
import { VendorModelDataControlsCard } from './VendorModelData.ControlsCard'

type VendorModelListsCardProps = {
  props?: any
} & React.ComponentProps<'div'>

const actionControls = [
  { label: 'Fetch Remote', action: fetchVendorModelLists },
  { label: 'Build Resources', action: buildResourceRecords },
  { label: 'Build Models', action: buildModels },
]

export async function VendorModelDataCardGroup({ className }: VendorModelListsCardProps) {
  const adminDao = await createAdminDao()

  const data = [
    await getLatestModelListDataForVendorId('openrouter'),
    await getLatestModelListDataForVendorId('togetherai'),
  ]

  const resources = await adminDao.resources.getAll()
  const models = await adminDao.models.getAll()

  return (
    <div className={cn('space-y-3 rounded-md border p-4', className)}>
      <h2 className="p-2 font-medium">VendorModelData</h2>
      <VendorModelDataControlsCard actionControls={actionControls} />

      <div>
        <p>Resources: {resources.length}</p>
        <p>Models: {models.length}</p>
      </div>

      <div className="flex w-full flex-wrap gap-3">
        {data.length === 0 ? (
          <PrePrint title="No Data">There is no data to display.</PrePrint>
        ) : (
          data.map(
            (d) =>
              d && (
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
              ),
          )
        )}
      </div>
    </div>
  )
}

const openai = [
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
