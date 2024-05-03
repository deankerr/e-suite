// input element components should be generic
import { Label } from '@radix-ui/react-label'
import { TextArea } from '@radix-ui/themes'

type EC_BlockProps = { props?: unknown } & React.ComponentProps<'label'>
export const EC_Block = ({ children }: EC_BlockProps) => {
  return <Label className="grid gap-0.5 font-mono text-xs">{children}</Label>
}

type EC_TextareaProps = { props?: unknown } & React.ComponentProps<typeof TextArea>
export const EC_Textarea = (props: EC_TextareaProps) => {
  return <TextArea size="3" {...props} />
}

type EL_PromptProps = { props?: unknown }
export const EL_Prompt = ({}: EL_PromptProps) => {
  return (
    <EC_Block>
      prompt
      <EC_Textarea name="prompt" />
    </EC_Block>
  )
}

type E_Generic_TextareaProps = { name: string; label?: string; placeholder?: string }
export const E_Generic_Textarea = ({ name, label, placeholder }: E_Generic_TextareaProps) => {
  return (
    <EC_Block>
      {label ?? name}
      <EC_Textarea name={name} placeholder={placeholder} />
    </EC_Block>
  )
}
