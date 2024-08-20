import { Card } from '@radix-ui/themes'
import Image from 'next/image'

import { EndpointBadge, endpointTokens } from '@/app/admin/Badges'
import AnthropicLogo from '@/assets/logos/anthropic.svg'
import CohereLogo from '@/assets/logos/cohere.svg'
import GoogleLogo from '@/assets/logos/google.svg'
import MetaLogo from '@/assets/logos/meta.svg'
import MistralAiLogo from '@/assets/logos/mistral.svg'
import OpenAiLogo from '@/assets/logos/openai.svg'
import { LinkButton } from '@/components/ui/LinkButton'
import { Skeleton } from '@/components/ui/Skeleton'
import { isValidUrl } from '@/convex/shared/helpers'
import { cn } from '@/lib/utils'

import type { EChatModel } from '@/convex/types'
import type { StaticImport } from 'next/dist/shared/lib/get-img-props'

export const ChatModelCard = ({
  model,
  className,
  ...props
}: { model: EChatModel } & React.ComponentProps<'div'>) => {
  const logoSrc = llmAuthorLogos[model.creatorName.toLowerCase()]

  const url = isValidUrl(model.link) ? new URL(model.link) : null
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
        <div className="mt-1 font-mono text-xs text-gray-11">{model.endpointModelId}</div>
      </div>

      <div className="flex grow gap-1 text-sm">
        <div className="text-gray-11">context length</div>
        <div className="text-sm">{model.contextLength.toLocaleString()}</div>
      </div>

      <div className={cn('flex shrink-0 flex-wrap items-end gap-2')}>
        <EndpointBadge endpoint={model.endpoint} />

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
  return <Skeleton className="h-40 w-72 max-w-full shrink-0 animate-pulse" />
}

const llmAuthorLogos: Record<string, string | StaticImport> = {
  anthropic: AnthropicLogo,
  cohere: CohereLogo,
  google: GoogleLogo,
  meta: MetaLogo,
  'meta-llama': MetaLogo,
  mistralai: MistralAiLogo,
  openai: OpenAiLogo,
}
