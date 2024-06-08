import { Badge, Card, Heading } from '@radix-ui/themes'

import type { EChatModel } from '@/convex/shared/shape'
import type { ButtonProps } from '@radix-ui/themes'

export const ChatModelCard = ({ model }: { model: EChatModel }) => {
  return (
    <Card className="space-y-2">
      <div className="">
        <Heading size="2">{model.name}</Heading>
        <Heading size="1">{model.creatorName}</Heading>
        <div className="font-mono text-xs">{model.slug}</div>
        <div className="font-mono text-xs text-accent-11">
          {model.endpoints.map((e) => (
            <Badge key={e.endpoint} color={endpointColors[e.endpoint]}>
              {e.endpoint}
            </Badge>
          ))}
        </div>
      </div>
      <div className="line-clamp-4 text-sm">{model.description}</div>
    </Card>
  )
}

const endpointColors: Record<string, ButtonProps['color']> = {
  openrouter: 'red',
  openai: 'green',
  together: 'iris',
}
