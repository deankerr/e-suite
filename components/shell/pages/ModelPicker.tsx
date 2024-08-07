import { useMemo } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useAtom } from 'jotai'

import { shellSelectedResourceKeyAtom } from '@/components/shell/atoms'
import { CmdK } from '@/components/shell/CmdK'
import { useIsCurrentPage, useShellStack } from '@/components/shell/hooks'
import { useChatModels, useImageModels } from '@/lib/api'

import type { EChatModel, EImageModel } from '@/convex/types'

export const ModelPicker = () => {
  const stack = useShellStack()

  const chatModels = useChatModels()
  const imageModels = useImageModels()
  const [selectedResourceKey, setSelectedResourceKey] = useAtom(shellSelectedResourceKeyAtom)
  const currentModel = useMemo(() => {
    if (selectedResourceKey) {
      return (
        chatModels?.find((model) => model.resourceKey === selectedResourceKey) ??
        imageModels?.find((model) => model.resourceKey === selectedResourceKey)
      )
    }
    return null
  }, [selectedResourceKey, chatModels, imageModels])

  const handleModelSelect = async (model: EChatModel | EImageModel) => {
    setSelectedResourceKey(model.resourceKey)
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
          <div className="grow text-right text-xs text-gray-10">{model.endpoint}</div>
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
          <div className="grow text-right text-xs text-gray-10">{model.endpoint}</div>
        </CmdK.Item>
      ))}
    </CmdK.Group>
  )

  const isCurrentPage = useIsCurrentPage('ModelPicker')
  if (!isCurrentPage) return null
  return (
    <>
      <CmdK.Group heading="Current">
        {currentModel ? (
          <CmdK.Item
            onSelect={() => {
              stack.pop()
            }}
          >
            <Icons.ArrowLeft className="phosphor" />
            {currentModel?.name}
            <div className="grow text-right text-xs text-gray-10">{currentModel?.endpoint}</div>
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

      {currentModel?.type === 'image' ? (
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
