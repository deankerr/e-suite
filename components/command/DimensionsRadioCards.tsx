import { RadioCards } from '@radix-ui/themes'
import { RectangleHorizontalIcon, RectangleVerticalIcon, SquareIcon } from 'lucide-react'

type DimensionsRadioCardsProps = { props?: unknown }

export const DimensionsRadioCards = ({}: DimensionsRadioCardsProps) => {
  return (
    <RadioCards.Root columns="3" size="1" gap="1" defaultValue="portrait">
      <RadioCards.Item value="portrait">
        <RectangleVerticalIcon />
        Portrait
      </RadioCards.Item>
      <RadioCards.Item value="square">
        <SquareIcon />
        Square
      </RadioCards.Item>
      <RadioCards.Item value="landscape">
        <RectangleHorizontalIcon />
        Landscape
      </RadioCards.Item>
    </RadioCards.Root>
  )
}
