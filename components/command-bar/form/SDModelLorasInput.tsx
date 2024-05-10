import {
  FormControl,
  FormInputNumber,
  FormInputText,
} from '@/components/command-bar/form/ParameterInputs'
import { cn } from '@/lib/utils'

type SDModelLorasInputProps = { props?: unknown } & React.ComponentProps<'div'>

export const SDModelLorasInput = ({ className, ...props }: SDModelLorasInputProps) => {
  // const [loraPath, setLoraPath] = useState("")
  // const [loraScale, setLoraScale] = useState("")
  return (
    <div {...props} className={cn('flex gap-2', className)}>
      <div className="flex gap-2">
        <FormControl>
          model name
          <FormInputText name="model_name" placeholder="SG161222/Realistic_Vision_V2.0" />
        </FormControl>

        <FormControl className="w-fit">
          variant
          <FormInputText name="variant" placeholder="fp16" />
        </FormControl>

        <FormControl className="w-fit">
          model_architecture
          <FormInputText name="model_architecture" placeholder="sdxl" />
        </FormControl>
      </div>

      <FormControl>
        lora name
        <FormInputText name="_lora_path" />
      </FormControl>

      <FormControl>
        lora scale
        <FormInputNumber name="_lora_scale" min={0} max={1} step={0.01} placeholder="0.75" />
      </FormControl>
    </div>
  )
}
