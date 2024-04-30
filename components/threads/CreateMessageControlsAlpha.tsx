import { Button, Card, Checkbox, Heading, Select, TextField } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'

import { SelectList } from '@/components/ui/SelectList'
import { api } from '@/convex/_generated/api'
import SinkinModels from '@/convex/providers/sinkin.models.json'

import type { Id } from '@/convex/_generated/dataModel'

const models = SinkinModels.map(({ id, name }) => ({
  label: name,
  value: id,
}))

type CreateMessageControlsAlphaProps = { threadId: Id<'threads'> }

export const CreateMessageControlsAlpha = ({ threadId }: CreateMessageControlsAlphaProps) => {
  const createMessage = useMutation(api.messages.create)
  const createMessageFormAction = (formData: FormData) => {
    const role = formData.get('role') as 'system' | 'assistant' | 'user'
    const name = formData.get('name') ? String(formData.get('name')) : undefined
    const content = formData.get('content') ? String(formData.get('content')) : ''
    console.log(role, name, content)

    createMessage({ threadId, message: { role, name, text: content } })
      .then(() => toast.success('Message created'))
      .catch((err) => {
        if (err instanceof Error) toast.error(err.message)
        else toast.error('Unknown error')
      })
  }

  const createGenerationFormAction = (formData: FormData) => {
    const prompt = String(formData.get('prompt'))
    const negative_prompt = formData.get('negative_prompt')
      ? String(formData.get('negative_prompt'))
      : undefined
    const model_id = String(formData.get('model_id'))
    const seed = formData.get('seed')
      ? Number(formData.get('seed'))
      : Math.floor(Math.random() * 10000000)

    const use_default_neg = formData.get('use_default_neg') ? true : false
    const guidance_scale = formData.get('guidance_scale')
      ? Number(formData.get('guidance_scale'))
      : undefined

    const square = Number(formData.get('square'))
    const portrait = Number(formData.get('portrait'))
    const landscape = Number(formData.get('landscape'))

    const dimensions = [
      { width: 512, height: 512, n: square },
      { width: 512, height: 768, n: portrait },
      { width: 768, height: 512, n: landscape },
    ].filter(({ n }) => n)

    createMessage({
      threadId,
      message: {
        role: 'assistant',
        inference: {
          generation: {
            parameters: {
              provider: 'sinkin',
              prompt,
              negative_prompt,
              model_id,
              seed,
              use_default_neg,
              guidance_scale,
            },
            dimensions,
          },
        },
      },
    })
      .then(() => toast.success('Generation created'))
      .catch((err) => {
        if (err instanceof Error) toast.error(err.message)
        else toast.error('Unknown error')
      })
  }

  return (
    <Card>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <form className="space-y-2" action={createMessageFormAction}>
          <Heading size="2" className="mb-2">
            Create Message
          </Heading>
          <div className="grid grid-cols-2">
            <Select.Root defaultValue="user" name="role">
              <Select.Trigger />
              <Select.Content>
                <Select.Group>
                  <Select.Label>Role</Select.Label>
                  <Select.Item value="user">User</Select.Item>
                  <Select.Item value="assistant">AI</Select.Item>
                  <Select.Item value="system">System</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>

            <TextField.Root placeholder="name" className="" id="name" name="name" />
          </div>

          <TextField.Root placeholder="content" className="grow" id="content" name="content" />

          <div className="flex-end">
            <Button variant="surface">Send</Button>
          </div>
        </form>

        <form className="space-y-2" action={createGenerationFormAction}>
          <Heading size="2" className="mb-2">
            Create generation
          </Heading>
          <TextField.Root placeholder="prompt" id="prompt" name="prompt" />
          <TextField.Root
            placeholder="negative prompt"
            id="negative_prompt"
            name="negative_prompt"
          />

          <SelectList items={models} name="model_id" placeholder="Model" />
          <TextField.Root placeholder="seed" id="seed" name="seed" />

          <div className="flex items-center gap-2">
            <div className="shrink-0">512x512</div>
            <div className="">
              <SelectList items={[0, 1, 2, 3, 4]} defaultValue="0" name="square" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="shrink-0">512x768</div>
            <div className="">
              <SelectList items={[0, 1, 2, 3, 4]} defaultValue="0" name="portrait" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="shrink-0">768x512</div>
            <div className="">
              <SelectList items={[0, 1, 2, 3, 4]} defaultValue="0" name="landscape" />
            </div>
          </div>

          <div className="grid gap-1">
            <label>guidance_scale</label>
            <TextField.Root placeholder="7.5" name="guidance_scale" type="number" />
          </div>

          <div className="gap-3 flex-start">
            <Checkbox name="use_default_neg" defaultChecked />
            <label>use_default_neg</label>
          </div>

          <div className="flex-end">
            <Button variant="surface">Send</Button>
          </div>
        </form>
      </div>
    </Card>
  )
}
