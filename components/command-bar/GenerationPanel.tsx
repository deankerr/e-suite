import { Button } from '@radix-ui/themes'

import { useCurrentModelAtom } from '@/components/command-bar/alphaAtoms'
import { DimensionsInput } from '@/components/command-bar/form/DimensionsInput'
import { FormLabel, inputRegister } from '@/components/command-bar/form/ParameterInputs'
import { QuantityInput } from '@/components/command-bar/form/QuantityInput'
import { useGenerationForm } from '@/components/command-bar/form/useGenerationForm'
import { ModelCard } from '@/components/command-bar/ModelCard'
import { PanelShell } from '@/components/command-bar/PanelShell'
import { paramBodySchemas } from '@/convex/lib/schemas'

export const GenerationPanel = () => {
  const { formAction } = useGenerationForm()

  const [currentModel] = useCurrentModelAtom()
  const formTarget = currentModel
    ? paramBodySchemas[currentModel.provider][currentModel.model_id] ??
      paramBodySchemas[currentModel.provider]['*']
    : []

  const formPromptInputs = formTarget?.filter((param) => param.element === 'textarea')
  const formFieldInputs = formTarget?.filter((param) =>
    ['number', 'select'].includes(param.element),
  )
  const formCheckboxInputs = formTarget?.filter((param) => param.element === 'checkbox')
  return (
    <PanelShell>
      <div className="p-1 font-mono text-xs">
        <form className="space-y-2 @container" action={formAction}>
          {formPromptInputs?.map((param) => inputRegister[param.element](param))}

          <div className="flex gap-2">
            {formFieldInputs?.map((param) => inputRegister[param.element](param))}
          </div>

          <div className="flex gap-2">
            {formCheckboxInputs?.map((param) => inputRegister[param.element](param))}
          </div>

          <div className="flex gap-2">
            <DimensionsInput />

            <div className="pb-0.5 flex-col-between">
              <QuantityInput />

              <Button variant="surface" size="3" className="w-full">
                Run
              </Button>
            </div>

            <div className="flex flex-col justify-between pb-3">
              <FormLabel htmlFor={'model'}>model</FormLabel>
              <ModelCard variant="nano" model={currentModel} />
            </div>
          </div>
        </form>
      </div>
    </PanelShell>
  )
}

export const generationPanelDef = {
  id: 'generation',
  name: 'Generation',
  buttonColor: 'tomato',
  element: GenerationPanel,
}
