import { useModelsApi } from '@/app/b/_providers/ModelsApiProvider'
import { CmdK } from '@/components/shell/CmdK'
import { useIsCurrentPage } from '@/components/shell/hooks'

export const ModelPicker = () => {
  const { chatModels, imageModels } = useModelsApi()

  const isCurrentPage = useIsCurrentPage('ModelPicker')
  if (!isCurrentPage) return null
  return (
    <>
      <CmdK.Group heading="Chat Models">
        {chatModels?.map((model) => (
          <CmdK.Item key={model._id} value={`${model.name} ${model.endpoint}`}>
            {model.name}
          </CmdK.Item>
        ))}
      </CmdK.Group>

      <CmdK.Group heading="Image Models">
        {imageModels?.map((model) => (
          <CmdK.Item key={model._id} value={`${model.name} ${model.endpoint}`}>
            {model.name}
          </CmdK.Item>
        ))}
      </CmdK.Group>
    </>
  )
}
