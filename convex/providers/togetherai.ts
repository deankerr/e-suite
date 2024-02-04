import { v } from 'convex/values'
import { internalAction, internalQuery } from '../_generated/server'
import { assert } from '../util'

const getApiKey = {
  togetherai: () => {
    const apiKey = process.env.TOGETHERAI_API_KEY
    assert(apiKey, 'TOGETHERAI_API_KEY is undefined')
    return apiKey
  },
}

type ChatMessage = { role: 'system' | 'user' | 'assistant'; name?: string; content: string }

type ChatOptions = {
  model: string
  max_tokens: number
  stop: string[]
  temperature: number
  top_p: number
  top_k: number
  repetition_penalty: number
  n: number
  messages: ChatMessage[]
}

const togetherai = async (options?: Partial<ChatOptions>) => {
  const body = {
    model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    max_tokens: 512,
    stop: ['</s>', '[/INST]'],
    temperature: 0.7,
    top_p: 0.7,
    top_k: 50,
    repetition_penalty: 1,
    n: 1,
    messages: [
      { role: 'user', content: 'This is a systems test, response with a full self-diagnostic.' },
    ],
    ...options,
  }

  const fetchOptions = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: `Bearer ${getApiKey.togetherai()}`,
    },
    body: JSON.stringify(body),
  }

  const response = await fetch('https://api.together.xyz/v1/chat/completions', fetchOptions)
  const json = await response.json()

  return json
}

export const runChat = internalAction({
  args: {
    endpoint: v.string(),
  },
  handler: async (ctx, args) => {
    const json = (await togetherai()) as { choices: Array<{ message: { content: string } }> }
    const msg = json.choices[0]?.message

    return msg
  },
})

export const getModels = internalQuery({
  handler: async () => {
    return models
  },
})

const models = {
  chat: [
    {
      organization: '01.AI',
      name: '01-ai Yi Chat (34B)',
      reference: 'zero-one-ai/Yi-34B-Chat',
      contextLength: 4096,
    },
    {
      organization: 'Austism',
      name: 'Chronos Hermes (13B)',
      reference: 'Austism/chronos-hermes-13b',
      contextLength: 2048,
    },
    {
      organization: 'DiscoResearch',
      name: 'DiscoLM Mixtral 8x7b',
      reference: 'DiscoResearch/DiscoLM-mixtral-8x7b-v2',
      contextLength: 32768,
    },
    {
      organization: 'Gryphe',
      name: 'MythoMax-L2 (13B)',
      reference: 'Gryphe/MythoMax-L2-13b',
      contextLength: 4096,
    },
    {
      organization: 'LM Sys',
      name: 'Vicuna v1.5 (13B)',
      reference: 'lmsys/vicuna-13b-v1.5',
      contextLength: 4096,
    },
    {
      organization: 'LM Sys',
      name: 'Vicuna v1.5 (7B)',
      reference: 'lmsys/vicuna-7b-v1.5',
      contextLength: 4096,
    },
    {
      organization: 'LM Sys',
      name: 'Vicuna v1.5 16K (13B)',
      reference: 'lmsys/vicuna-13b-v1.5-16k',
      contextLength: 16384,
    },
    {
      organization: 'Meta',
      name: 'Code Llama Instruct (13B)',
      reference: 'codellama/CodeLlama-13b-Instruct-hf',
      contextLength: 16384,
    },
    {
      organization: 'Meta',
      name: 'Code Llama Instruct (34B)',
      reference: 'codellama/CodeLlama-34b-Instruct-hf',
      contextLength: 16384,
    },
    {
      organization: 'Meta',
      name: 'Code Llama Instruct (70B)',
      reference: 'codellama/CodeLlama-70b-Instruct-hf',
      contextLength: 4096,
    },
    {
      organization: 'Meta',
      name: 'Code Llama Instruct (7B)',
      reference: 'codellama/CodeLlama-7b-Instruct-hf',
      contextLength: 16384,
    },
    {
      organization: 'Meta',
      name: 'LLaMA-2 Chat (13B)',
      reference: 'togethercomputer/llama-2-13b-chat',
      contextLength: 4096,
    },
    {
      organization: 'Meta',
      name: 'LLaMA-2 Chat (70B)',
      reference: 'togethercomputer/llama-2-70b-chat',
      contextLength: 4096,
    },
    {
      organization: 'Meta',
      name: 'LLaMA-2 Chat (7B)',
      reference: 'togethercomputer/llama-2-7b-chat',
      contextLength: 4096,
    },
    {
      organization: 'NousResearch',
      name: 'Nous Capybara v1.9 (7B)',
      reference: 'NousResearch/Nous-Capybara-7B-V1p9',
      contextLength: 8192,
    },
    {
      organization: 'NousResearch',
      name: 'Nous Hermes 2 - Mixtral 8x7B-DPO',
      reference: 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO',
      contextLength: 32768,
    },
    {
      organization: 'NousResearch',
      name: 'Nous Hermes 2 - Mixtral 8x7B-SFT',
      reference: 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-SFT',
      contextLength: 32768,
    },
    {
      organization: 'NousResearch',
      name: 'Nous Hermes LLaMA-2 (70B)',
      reference: 'NousResearch/Nous-Hermes-Llama2-70b',
      contextLength: 4096,
    },
    {
      organization: 'NousResearch',
      name: 'Nous Hermes LLaMA-2 (7B)',
      reference: 'NousResearch/Nous-Hermes-llama-2-7b',
      contextLength: 4096,
    },
    {
      organization: 'NousResearch',
      name: 'Nous Hermes Llama-2 (13B)',
      reference: 'NousResearch/Nous-Hermes-Llama2-13b',
      contextLength: 4096,
    },
    {
      organization: 'NousResearch',
      name: 'Nous Hermes-2 Yi (34B)',
      reference: 'NousResearch/Nous-Hermes-2-Yi-34B',
      contextLength: 4096,
    },
    {
      organization: 'OpenChat',
      name: 'OpenChat 3.5',
      reference: 'openchat/openchat-3.5-1210',
      contextLength: 8192,
    },
    {
      organization: 'OpenOrca',
      name: 'OpenOrca Mistral (7B) 8K',
      reference: 'Open-Orca/Mistral-7B-OpenOrca',
      contextLength: 8192,
    },
    {
      organization: 'Qwen',
      name: 'Qwen-Chat (7B)',
      reference: 'togethercomputer/Qwen-7B-Chat',
      contextLength: 8192,
    },
    {
      organization: 'Snorkel AI',
      name: 'Snorkel Mistral PairRM DPO (7B)',
      reference: 'snorkelai/Snorkel-Mistral-PairRM-DPO',
      contextLength: 32768,
    },
    {
      organization: 'Stanford',
      name: 'Alpaca (7B)',
      reference: 'togethercomputer/alpaca-7b',
      contextLength: 2048,
    },
    {
      organization: 'TII UAE',
      name: 'Falcon Instruct (40B)',
      reference: 'togethercomputer/falcon-40b-instruct',
      contextLength: 2048,
    },
    {
      organization: 'TII UAE',
      name: 'Falcon Instruct (7B)',
      reference: 'togethercomputer/falcon-7b-instruct',
      contextLength: 2048,
    },
    {
      organization: 'Together',
      name: 'GPT-NeoXT-Chat-Base (20B)',
      reference: 'togethercomputer/GPT-NeoXT-Chat-Base-20B',
      contextLength: 2048,
    },
    {
      organization: 'Together',
      name: 'LLaMA-2-7B-32K-Instruct (7B)',
      reference: 'togethercomputer/Llama-2-7B-32K-Instruct',
      contextLength: 32768,
    },
    {
      organization: 'Together',
      name: 'Pythia-Chat-Base (7B)',
      reference: 'togethercomputer/Pythia-Chat-Base-7B-v0.16',
      contextLength: 2048,
    },
    {
      organization: 'Together',
      name: 'RedPajama-INCITE Chat (3B)',
      reference: 'togethercomputer/RedPajama-INCITE-Chat-3B-v1',
      contextLength: 2048,
    },
    {
      organization: 'Together',
      name: 'RedPajama-INCITE Chat (7B)',
      reference: 'togethercomputer/RedPajama-INCITE-7B-Chat',
      contextLength: 2048,
    },
    {
      organization: 'Together',
      name: 'StripedHyena Nous (7B)',
      reference: 'togethercomputer/StripedHyena-Nous-7B',
      contextLength: 32768,
    },
    {
      organization: 'Undi95',
      name: 'ReMM SLERP L2 (13B)',
      reference: 'Undi95/ReMM-SLERP-L2-13B',
      contextLength: 4096,
    },
    {
      organization: 'Undi95',
      name: 'Toppy M (7B)',
      reference: 'Undi95/Toppy-M-7B',
      contextLength: 4096,
    },
    {
      organization: 'WizardLM',
      name: 'WizardLM v1.2 (13B)',
      reference: 'WizardLM/WizardLM-13B-V1.2',
      contextLength: 4096,
    },
    {
      organization: 'garage-bAInd',
      name: 'Platypus2 Instruct (70B)',
      reference: 'garage-bAInd/Platypus2-70B-instruct',
      contextLength: 4096,
    },
    {
      organization: 'mistralai',
      name: 'Mistral (7B) Instruct',
      reference: 'mistralai/Mistral-7B-Instruct-v0.1',
      contextLength: 4096,
    },
    {
      organization: 'mistralai',
      name: 'Mistral (7B) Instruct v0.2',
      reference: 'mistralai/Mistral-7B-Instruct-v0.2',
      contextLength: 32768,
    },
    {
      organization: 'mistralai',
      name: 'Mixtral-8x7B Instruct',
      reference: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      contextLength: 32768,
    },
    {
      organization: 'teknium',
      name: 'OpenHermes-2-Mistral (7B)',
      reference: 'teknium/OpenHermes-2-Mistral-7B',
      contextLength: 8192,
    },
    {
      organization: 'teknium',
      name: 'OpenHermes-2.5-Mistral (7B)',
      reference: 'teknium/OpenHermes-2p5-Mistral-7B',
      contextLength: 8192,
    },
    {
      organization: 'upstage',
      name: 'Upstage SOLAR Instruct v1 (11B)',
      reference: 'upstage/SOLAR-10.7B-Instruct-v1.0',
      contextLength: 4096,
    },
  ],
  completion: [
    {
      organization: '01.AI',
      name: '01-ai Yi Base (34B)',
      reference: 'zero-one-ai/Yi-34B',
      contextLength: 4096,
    },
    {
      organization: '01.AI',
      name: '01-ai Yi Base (6B)',
      reference: 'zero-one-ai/Yi-6B',
      contextLength: 4096,
    },
    {
      organization: 'EleutherAI',
      name: 'Llemma (7B)',
      reference: 'EleutherAI/llemma_7b',
      contextLength: 4096,
    },
    {
      organization: 'Meta',
      name: 'LLaMA (65B)',
      reference: 'huggyllama/llama-65b',
      contextLength: 2048,
    },
    {
      organization: 'Meta',
      name: 'LLaMA-2 (13B)',
      reference: 'togethercomputer/llama-2-13b',
      contextLength: 4096,
    },
    {
      organization: 'Meta',
      name: 'LLaMA-2 (70B)',
      reference: 'togethercomputer/llama-2-70b',
      contextLength: 4096,
    },
    {
      organization: 'Meta',
      name: 'LLaMA-2 (7B)',
      reference: 'togethercomputer/llama-2-7b',
      contextLength: 4096,
    },
    {
      organization: 'Microsoft',
      name: 'Microsoft Phi-2',
      reference: 'microsoft/phi-2',
      contextLength: 2048,
    },
    {
      organization: 'Nexusflow',
      name: 'NexusRaven (13B)',
      reference: 'Nexusflow/NexusRaven-V2-13B',
      contextLength: 16384,
    },
    {
      organization: 'Qwen',
      name: 'Qwen (7B)',
      reference: 'togethercomputer/Qwen-7B',
      contextLength: 8192,
    },
    {
      organization: 'TII UAE',
      name: 'Falcon (40B)',
      reference: 'togethercomputer/falcon-40b',
      contextLength: 2048,
    },
    {
      organization: 'TII UAE',
      name: 'Falcon (7B)',
      reference: 'togethercomputer/falcon-7b',
      contextLength: 2048,
    },
    {
      organization: 'Together',
      name: 'GPT-JT (6B)',
      reference: 'togethercomputer/GPT-JT-6B-v1',
      contextLength: 2048,
    },
    {
      organization: 'Together',
      name: 'GPT-JT-Moderation (6B)',
      reference: 'togethercomputer/GPT-JT-Moderation-6B',
      contextLength: 2048,
    },
    {
      organization: 'Together',
      name: 'LLaMA-2-32K (7B)',
      reference: 'togethercomputer/LLaMA-2-7B-32K',
      contextLength: 32768,
    },
    {
      organization: 'Together',
      name: 'RedPajama-INCITE (3B)',
      reference: 'togethercomputer/RedPajama-INCITE-Base-3B-v1',
      contextLength: 2048,
    },
    {
      organization: 'Together',
      name: 'RedPajama-INCITE (7B)',
      reference: 'togethercomputer/RedPajama-INCITE-7B-Base',
      contextLength: 2048,
    },
    {
      organization: 'Together',
      name: 'RedPajama-INCITE Instruct (3B)',
      reference: 'togethercomputer/RedPajama-INCITE-Instruct-3B-v1',
      contextLength: 2048,
    },
    {
      organization: 'Together',
      name: 'RedPajama-INCITE Instruct (7B)',
      reference: 'togethercomputer/RedPajama-INCITE-7B-Instruct',
      contextLength: 2048,
    },
    {
      organization: 'Together',
      name: 'StripedHyena Hessian (7B)',
      reference: 'togethercomputer/StripedHyena-Hessian-7B',
      contextLength: 32768,
    },
    {
      organization: 'WizardLM',
      name: 'WizardLM v1.0 (70B)',
      reference: 'WizardLM/WizardLM-70B-V1.0',
      contextLength: 4096,
    },
    {
      organization: 'mistralai',
      name: 'Mistral (7B)',
      reference: 'mistralai/Mistral-7B-v0.1',
      contextLength: 4096,
    },
    {
      organization: 'mistralai',
      name: 'Mixtral-8x7B',
      reference: 'mistralai/Mixtral-8x7B-v0.1',
      contextLength: 32768,
    },
  ],
}
