import { IconButton } from '@radix-ui/themes'
import { MinusCircleIcon } from 'lucide-react'

import {
  FormControl,
  FormInputNumber,
  FormInputSelect,
  FormInputText,
} from '@/components/command-bar/form/ParameterInputs'
import { cn } from '@/lib/utils'

type SDModelLorasInputProps = { props?: unknown } & React.ComponentProps<'div'>

export const SDModelLorasInput = ({ className, ...props }: SDModelLorasInputProps) => {
  // const [loraPath, setLoraPath] = useState("")
  // const [loraScale, setLoraScale] = useState("")

  return (
    <div {...props} className={cn('flex gap-2', className)}>
      <div className="grid w-fit gap-2 border">
        <FormControl>
          model name
          <FormInputText name="model_name" placeholder="SG161222/Realistic_Vision_V2.0" />
        </FormControl>

        <div className="flex gap-2">
          <FormControl className="w-24">
            variant
            <FormInputText name="variant" placeholder="fp16" />
          </FormControl>

          <FormControl className="w-fit">
            model_architecture
            <FormInputSelect name="model_architecture" items={['sd', 'sdxl']} />
          </FormControl>
        </div>
      </div>

      <div className="grid min-w-64 gap-2 border">
        <div className="flex h-fit items-center gap-2">
          <FormControl className="h-fit">
            lora path
            <FormInputText name="_lora_path" />
          </FormControl>

          <FormControl className="h-fit w-16">
            scale
            <FormInputNumber name="_lora_scale" min={0} max={1} step={0.01} placeholder="0.75" />
          </FormControl>

          <IconButton variant="soft" className="mt-4">
            <MinusCircleIcon />
          </IconButton>
        </div>
      </div>
    </div>
  )
}
