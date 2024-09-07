import { forwardRef } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'

import { useChatModels } from '@/app/lib/api/models'
import { Button } from '@/components/ui/Button'

const modelIcons: Record<string, React.ReactNode> = {
  fallback: <Icons.Cube size={18} />,
  chat: <Icons.Chat size={18} className="-translate-y-px" />,
  image: <Icons.ImageSquare size={18} />,
}

export const ModelButton = forwardRef<
  HTMLButtonElement,
  { resourceKey?: string } & Partial<React.ComponentProps<typeof Button>>
>(({ resourceKey, ...props }, ref) => {
  const chatModels = useChatModels()
  const model = chatModels?.find((model) => model.resourceKey === resourceKey)

  const icon = modelIcons[model?.type ?? 'fallback']
  const label = model?.name ?? 'Select model'
  return (
    <Button
      ref={ref}
      variant="surface"
      color="gray"
      className="shrink justify-start gap-1 overflow-hidden px-1.5 text-start [&>svg]:shrink-0"
      {...props}
    >
      {icon}
      <div className="truncate">{label}</div>
      <Icons.CaretUpDown />
    </Button>
  )
})

ModelButton.displayName = 'ModelButton'
