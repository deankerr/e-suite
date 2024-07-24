import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useAtom } from 'jotai'
import { toast } from 'sonner'

import { useModelsApi } from '@/components/providers/ModelsApiProvider'
import { shellSelectedModelAtom } from '@/components/shell/atoms'
import { CmdK } from '@/components/shell/CmdK'
import { useIsCurrentPage, useShellStack, useShellUserThreads } from '@/components/shell/hooks'
import { useUpdateCurrentThreadModel } from '@/lib/api'

import type { EChatModel, EImageModel } from '@/convex/types'

export const ModelPicker = () => {
  const { chatModels, imageModels } = useModelsApi()
  const [selectedModel, setSelectedModel] = useAtom(shellSelectedModelAtom)
  const threads = useShellUserThreads()
  const stack = useShellStack()

  const sendUpdateCurrentThreadModel = useUpdateCurrentThreadModel()

  const handleModelSelect = async (model: EChatModel | EImageModel) => {
    if (threads.current) {
      try {
        await sendUpdateCurrentThreadModel({
          threadId: threads.current._id,
          type: model.type,
          resourceKey: model.resourceKey,
        })
      } catch (err) {
        console.error(err)
        toast.error('Failed to update model')
      }
    } else {
      setSelectedModel(model)
    }

    stack.pop()
  }

  const chatModelList = (
    <CmdK.Group heading="Chat Models">
      {chatModels?.map((model) => (
        <CmdK.Item
          key={model._id}
          value={`${model.name} ${model.endpoint}`}
          onSelect={() => handleModelSelect(model)}
        >
          <Icons.Cube className="phosphor" />
          <Icons.Chat className="phosphor -ml-3 -mt-0.5" />
          {model.name}
        </CmdK.Item>
      ))}
    </CmdK.Group>
  )

  const imageModelList = (
    <CmdK.Group heading="Image Models">
      {imageModels?.map((model) => (
        <CmdK.Item
          key={model._id}
          value={`${model.name} ${model.endpoint}`}
          onSelect={() => handleModelSelect(model)}
        >
          <Icons.Cube className="phosphor" />
          <Icons.ImageSquare className="phosphor -ml-3" />
          {model.name}
        </CmdK.Item>
      ))}
    </CmdK.Group>
  )

  const isCurrentPage = useIsCurrentPage('ModelPicker')
  if (!isCurrentPage) return null
  return (
    <>
      <CmdK.Group heading="Current">
        {selectedModel ? (
          <CmdK.Item
            onSelect={() => {
              stack.pop()
            }}
          >
            <Icons.ArrowLeft className="phosphor" />
            {selectedModel?.name}
          </CmdK.Item>
        ) : (
          <CmdK.Item
            onSelect={() => {
              stack.pop()
            }}
          >
            No model selected
          </CmdK.Item>
        )}
      </CmdK.Group>

      {selectedModel?.type === 'image' ? (
        <>
          {imageModelList}
          {chatModelList}
        </>
      ) : (
        <>
          {chatModelList}
          {imageModelList}
        </>
      )}
    </>
  )
}
