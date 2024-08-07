import * as Icons from '@phosphor-icons/react/dist/ssr'

import { Button } from '@/components/ui/Button'
import { useModels } from '@/lib/api'

const modelIcons: Record<string, React.ReactNode> = {
  chat: <Icons.Chat size={18} className="-translate-y-px" />,
  image: <Icons.ImageSquare size={18} />,
}

export const ModelButton = ({
  resourceKey,
  ...props
}: { resourceKey?: string } & Partial<React.ComponentProps<typeof Button>>) => {
  const { model } = useModels(resourceKey)
  const icon = modelIcons[model?.type ?? 'chat']
  const label = model?.name ?? 'Select model'
  return (
    <Button
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
}
