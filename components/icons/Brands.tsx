import { memo } from 'react'
import {
  Claude,
  Cohere,
  DeepSeek,
  Gemini,
  Gemma,
  Meta,
  Mistral,
  OpenAI,
  OpenRouter,
  Together,
  ZeroOne,
} from '@lobehub/icons'
import * as Icons from '@phosphor-icons/react/dist/ssr'

import type { IconType } from '@lobehub/icons'

const brandIcons = [
  {
    name: 'anthropic',
    icon: Claude,
  },
  {
    name: 'cohere',
    icon: Cohere,
  },
  {
    name: 'deepseek',
    icon: DeepSeek,
  },
  {
    name: 'gemini',
    icon: Gemini,
  },
  {
    name: 'gemma',
    icon: Gemma,
  },
  {
    name: '01.AI',
    icon: ZeroOne,
  },
  {
    name: 'meta',
    icon: Meta,
  },
  {
    name: 'llama',
    icon: Meta,
  },
  {
    name: 'mistral',
    icon: Mistral,
  },
  {
    name: 'mixtral',
    icon: Mistral,
  },
  {
    name: 'openai',
    icon: OpenAI,
  },
  {
    name: 'GPT-4o',
    icon: OpenAI,
  },
  {
    name: 'GPT-4',
    icon: OpenAI,
  },
  {
    name: 'GPT-3',
    icon: OpenAI,
  },
  {
    name: 'openrouter',
    icon: OpenRouter,
  },
  {
    name: 'together',
    icon: Together,
  },
]

export const BrandIcon = memo(
  ({ name, ...props }: { name: string } & React.ComponentProps<IconType>) => {
    const Icon = brandIcons.find((brand) =>
      name.toLowerCase().includes(brand.name.toLowerCase()),
    )?.icon
    if (!Icon) return <Icons.Cube {...props} />
    return <Icon {...props} />
  },
)
BrandIcon.displayName = 'BrandIcon'
