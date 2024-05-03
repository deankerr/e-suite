import { forwardRef } from 'react'
import { Label } from '@radix-ui/react-label'
import { TextArea, TextField } from '@radix-ui/themes'

export const FormControl = ({ children }: React.ComponentProps<'label'>) => {
  return <Label className="grid gap-0.5 font-mono text-xs">{children}</Label>
}

export const FormInputTextarea = forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<typeof TextArea>
>(function FormInputTextarea(props, forwardedRef) {
  return <TextArea size="3" {...props} ref={forwardedRef} />
})

export const FormInputInteger = forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof TextField.Root>
>(function FormInputTextarea(props, forwardedRef) {
  return <TextField.Root size="3" type="number" {...props} ref={forwardedRef} />
})

// type FormTextareaProps = { name: string; label?: string; placeholder?: string }

// export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
//   function FormTextarea({ className, ...props }, forwardedRef) {
//     return (
//       <div {...props} className={cn('', className)} ref={forwardedRef}>
//         <p>FormTextarea</p>
//       </div>
//     )
//   },
// )

/*
 Log file: /Users/dean/Library/Application Support/Code/logs/20240503T050831/window1/exthost/vscode.typescript-language-features/tsserver-log-ZtX6Hv/tsserver.log
2024-05-03 18:40:48.464 [info] <syntax> Trace directory: /Users/dean/Library/Application Support/Code/logs/20240503T050831/window1/exthost/vscode.typescript-language-features/tsserver-log-lLWyoB
2024-05-03 18:40:48.464 [info] <syntax> Forking...
2024-05-03 18:40:48.464 [info] <syntax> Starting...
2024-05-03 18:40:48.464 [info] <semantic> Log file: /Users/dean/Library/Application Support/Code/logs/20240503T050831/window1/exthost/vscode.typescript-language-features/tsserver-log-yHnUC8/tsserver.log
2024-05-03 18:40:48.465 [info] <semantic> Trace directory: /Users/dean/Library/Application Support/Code/logs/20240503T050831/window1/exthost/vscode.typescript-language-features/tsserver-log-GtMUf2

*/
