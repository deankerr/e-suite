import { Button, ButtonProps, Card } from '@radix-ui/themes'
import { accentColors } from '@radix-ui/themes/props'
import Image from 'next/image'
import Link from 'next/link'

import { EndpointBadge, endpointTokens } from '@/app/admin/Badges'
import { SkeletonPulse } from '@/components/ui/Skeleton'
import { getURLIfValid } from '@/convex/shared/helpers'
import { cn } from '@/lib/utils'

import type { EChatModel } from '@/convex/types'
import type { StaticImport } from 'next/dist/shared/lib/get-img-props'

export const ChatModelCard = ({
  model,
  className,
  ...props
}: { model: EChatModel } & React.ComponentProps<'div'>) => {
  const logoSrc = llmAuthorLogos[model.creatorName.toLowerCase()]

  const url = getURLIfValid(model.link)
  return (
    <Card {...props} className={cn('flex h-40 w-72 max-w-full shrink-0 flex-col', className)}>
      <div>
        <div className="flex justify-between text-sm font-medium text-gray-11">
          {model.creatorName}
          {logoSrc && (
            <Image
              src={logoSrc}
              alt=""
              className="-mb-1.5 h-6 w-6 object-contain brightness-50 saturate-50"
            />
          )}
        </div>
        <div className="text-sm font-medium">{model.name}</div>
        <div className="mt-1 font-mono text-xs text-gray-11">{model.modelId}</div>
      </div>

      <div className="flex grow gap-1 text-sm">
        <div className="text-gray-11">context length</div>
        <div className="text-sm">{model.contextLength.toLocaleString()}</div>
      </div>

      <div className={cn('flex shrink-0 flex-wrap items-end gap-2')}>
        <EndpointBadge endpoint={model.provider} />

        {url?.host.endsWith('civitai.com') ? (
          <LinkButton href={model.link} color={endpointTokens('civitai').color}>
            {endpointTokens('civitai').name}
          </LinkButton>
        ) : url?.host.endsWith('huggingface.co') ? (
          <LinkButton href={model.link} color={endpointTokens('huggingface').color}>
            {endpointTokens('huggingface').name}
          </LinkButton>
        ) : model.link ? (
          <LinkButton href={model.link} />
        ) : null}
      </div>
    </Card>
  )
}

export const ChatModelCardSkeleton = () => {
  return <SkeletonPulse className="h-40 w-72 max-w-full shrink-0 animate-pulse" />
}

const llmAuthorLogos: Record<string, string | StaticImport> = {
  // anthropic: AnthropicLogo,
  // cohere: CohereLogo,
  // google: GoogleLogo,
  // meta: MetaLogo,
  // 'meta-llama': MetaLogo,
  // mistralai: MistralAiLogo,
  // openai: OpenAiLogo,
}

const LinkButton = ({
  color,
  variant,
  className,
  children,
  ...props
}: {
  color?: (typeof accentColors)[number]
  variant?: ButtonProps['variant']
} & React.ComponentProps<typeof Link>) => {
  return (
    <Link {...props} className={cn('shrink-0', className)}>
      <Button variant={variant ?? 'soft'} color={color} size="1">
        {children}
      </Button>
    </Link>
  )
}
