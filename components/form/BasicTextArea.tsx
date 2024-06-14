import { Label } from '@radix-ui/react-label'
import { TextArea } from '@radix-ui/themes'

export const BasicTextArea = ({
  label,
  ...props
}: { label: string } & React.ComponentProps<typeof TextArea>) => {
  return (
    <Label className="grid gap-1 text-sm">
      {label}
      <TextArea {...props} />
    </Label>
  )
}
