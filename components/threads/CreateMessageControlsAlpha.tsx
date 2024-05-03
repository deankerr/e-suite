import { useState } from 'react'
import { Button, Card, Checkbox, Heading, Select, TextField } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'

import { SelectList } from '@/components/ui/SelectList'
import { api } from '@/convex/_generated/api'

import type { Id } from '@/convex/_generated/dataModel'

// const sinkinModels = textToImageModels.sinkin.map(({ model_id, name }) => ({
//   label: name,
//   value: model_id,
// }))

// const falModels = textToImageModels.fal.map(({ model_id, name }) => ({
//   label: name,
//   value: model_id,
// }))

type CreateMessageControlsAlphaProps = { threadId: Id<'threads'> }

export const CreateMessageControlsAlpha = ({ threadId }: CreateMessageControlsAlphaProps) => {
  const [currentProvider, setCurrentProvider] = useState<'sinkin' | 'fal'>('fal')

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

    // const model_id = String(formData.get('model_id'))
    const model_id = currentProvider === 'fal' ? 'fal-ai/hyper-sdxl' : '4zdwGOB'
    const seed = formData.get('seed') ? Number(formData.get('seed')) : undefined

    const use_default_neg = formData.get('use_default_neg') ? true : false
    const guidance_scale = formData.get('guidance_scale')
      ? Number(formData.get('guidance_scale'))
      : undefined

    const steps = formData.get('steps') ? Number(formData.get('steps')) : undefined

    const square = Number(formData.get('square'))
    const square_hd = Number(formData.get('square_hd'))
    const portrait_3_4 = Number(formData.get('portrait_3_4'))
    const portrait_9_16 = Number(formData.get('portrait_9_16'))
    const landscape_4_3 = Number(formData.get('landscape_4_3'))
    const landscape_16_9 = Number(formData.get('landscape_16_9'))

    const falDimensions = [
      { width: 512, height: 512, n: square },
      { width: 1024, height: 1024, n: square_hd },
      { width: 768, height: 1024, n: portrait_3_4 },
      { width: 576, height: 1024, n: portrait_9_16 },
      { width: 1024, height: 768, n: landscape_4_3 },
      { width: 1024, height: 576, n: landscape_16_9 },
    ]

    const sinkinDimensions = [
      { width: 512, height: 512, n: square },
      { width: 512, height: 768, n: portrait_3_4 },
      { width: 768, height: 512, n: landscape_4_3 },
    ]

    const dimensions = (currentProvider === 'sinkin' ? sinkinDimensions : falDimensions).filter(
      ({ n }) => n,
    )

    createMessage({
      threadId,
      message: {
        role: 'assistant',
        inference: {
          generation: {
            parameters: {
              provider: currentProvider,
              prompt,
              negative_prompt,
              model_id,
              seed,
              use_default_neg,
              guidance_scale,
              steps,
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
      <div className="flex gap-4 ">
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

        <form className="flex gap-2" action={createGenerationFormAction}>
          {/* left */}
          <div className="min-w-80">
            <Heading size="2" className="mb-2">
              Create generation
            </Heading>
            <TextField.Root placeholder="prompt" id="prompt" name="prompt" />
            <TextField.Root
              placeholder="negative prompt"
              id="negative_prompt"
              name="negative_prompt"
            />

            <SelectList
              items={['sinkin', 'fal']}
              name="provider"
              value={currentProvider}
              onValueChange={(v) => setCurrentProvider(v as 'sinkin' | 'fal')}
            />
            {/* <SelectList
              items={currentProvider === 'sinkin' ? sinkinModels : falModels}
              name="model_id"
              placeholder="Model"
            /> */}

            {/* left end */}
          </div>

          {/* right */}
          <div className="min-w-80 space-y-2">
            <div className="flex gap-1">
              <TextField.Root placeholder="guidance_scale" name="guidance_scale" type="number" />
              <TextField.Root name="steps" placeholder="steps" type="number" />
              <TextField.Root placeholder="seed" id="seed" name="seed" />
            </div>

            <div className="flex gap-2">
              {/* sizes 1 */}
              <div className="grid justify-items-end gap-2">
                <div className="flex items-center gap-2">
                  <div className="shrink-0">Square</div>
                  <div>
                    <SelectList items={[0, 1, 2, 3, 4, 10]} defaultValue="0" name="square" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="shrink-0">Portrait 3:4</div>
                  <div>
                    <SelectList items={[0, 1, 2, 3, 4]} defaultValue="0" name="portrait_3_4" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="shrink-0">Landscape 4:3</div>
                  <div>
                    <SelectList items={[0, 1, 2, 3, 4]} defaultValue="0" name="landscape_4_3" />
                  </div>
                </div>
              </div>

              {/* sizes 2 */}
              <div className="grid justify-items-end gap-2">
                <div className="flex items-center gap-2">
                  <div className="shrink-0">Square HD</div>
                  <div>
                    <SelectList items={[0, 1, 2, 3, 4]} defaultValue="0" name="square_hd" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="shrink-0">Portrait 9:16</div>
                  <div>
                    <SelectList items={[0, 1, 2, 3, 4]} defaultValue="0" name="portrait_9_16" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="shrink-0">Landscape 16:9</div>
                  <div>
                    <SelectList items={[0, 1, 2, 3, 4]} defaultValue="0" name="landscape_16_9" />
                  </div>
                </div>
              </div>
            </div>

            <div className="gap-3 flex-start">
              <Checkbox name="use_default_neg" defaultChecked />
              <label>use_default_neg</label>
            </div>

            <div className="flex-end">
              <Button variant="surface">Send</Button>
            </div>
          </div>
        </form>
      </div>
    </Card>
  )
}
