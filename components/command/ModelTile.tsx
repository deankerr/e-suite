import { Card, Inset } from '@radix-ui/themes'
import NextImage from 'next/image'

import Llama from '@/assets/future-llama-70b-chat.jpg'
import PixArtCactus from '@/assets/pixart-cactus.png'

type ModelTileProps = { model: 'pixart' | 'llama' }

export const ModelTile = ({ model }: ModelTileProps) => {
  const image = model === 'pixart' ? PixArtCactus : Llama
  const text = model === 'pixart' ? 'PixArt Alpha' : 'Llama3'
  return (
    <Card className="w-36">
      <div className="">
        <Inset side="all">
          <NextImage src={image} alt="" className="" />
          <div className="absolute inset-x-0 bottom-0 bg-overlay p-2 text-sm font-medium flex-center">
            {text}
          </div>
        </Inset>
      </div>
    </Card>
  )
}
