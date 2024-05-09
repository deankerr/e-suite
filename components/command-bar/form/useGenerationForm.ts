import { useGenerationQuantity } from '@/components/command-bar/alphaAtoms'

export const useGenerationForm = () => {
  const [quantity] = useGenerationQuantity()
  // eslint-disable-next-line @typescript-eslint/require-await
  const formAction = (formData: FormData) => {
    console.log('submit', 'quantity', quantity)
    console.table([...formData.entries()])
  }

  return { formAction }
}
