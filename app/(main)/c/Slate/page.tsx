import { CardLite } from '@/app/components/ui/CardLite'
import logoPng from '@/assets/e-suite-logo.png'
import robocop from '@/assets/robocop.webp'
import { Heading, Inset, Card as RXCard } from '@radix-ui/themes'
import NextImage from 'next/image'

export default function SlatePage() {
  // Page

  return (
    <div className="h-[90vh] w-[86vw] space-y-4 place-self-center border border-accent-2 bg-sand-8 p-8">
      <RXCard>
        <div className="flex gap-2">
          <Inset className="flex-none">
            <NextImage src={robocop} alt="" width={256} height={512} />
          </Inset>

          <div className="">
            <NextImage src={logoPng} alt="" width={150} height={150} />
            <Heading>RXCard</Heading>
            <p>
              Dolor nostrud do ea id eu et labore et veniam eiusmod. Cillum qui do anim est enim
              officia reprehenderit non. Ad voluptate eu Lorem excepteur nulla voluptate nostrud
              magna aliqua fugiat dolore exercitation dolore. Velit ullamco cupidatat veniam
              cupidatat mollit amet occaecat aliqua esse amet. Quis sit sit reprehenderit proident
              non elit incididunt anim enim. Nostrud Lorem Lorem non eiusmod aliqua consequat.
              Aliquip exercitation tempor consequat aliqua voluptate sunt non ad sint quis consequat
              cupidatat eiusmod excepteur. Excepteur aute nisi aliquip est commodo duis incididunt
              sunt cupidatat officia irure commodo et laborum.
            </p>
          </div>
        </div>
      </RXCard>

      <CardLite className="flex gap-2">
        <Inset className="-m-rx-2 flex-none rounded">
          <NextImage src={robocop} alt="" width={256} height={512} />
        </Inset>

        <div className="">
          <NextImage src={logoPng} alt="" width={150} height={150} />
          <Heading>NewCard</Heading>

          <p>
            Dolor nostrud do ea id eu et labore et veniam eiusmod. Cillum qui do anim est enim
            officia reprehenderit non. Ad voluptate eu Lorem excepteur nulla voluptate nostrud magna
            aliqua fugiat dolore exercitation dolore. Velit ullamco cupidatat veniam cupidatat
            mollit amet occaecat aliqua esse amet. Quis sit sit reprehenderit proident non elit
            incididunt anim enim. Nostrud Lorem Lorem non eiusmod aliqua consequat. Aliquip
            exercitation tempor consequat aliqua voluptate sunt non ad sint quis consequat cupidatat
            eiusmod excepteur. Excepteur aute nisi aliquip est commodo duis incididunt sunt
            cupidatat officia irure commodo et laborum.
          </p>
        </div>
      </CardLite>
    </div>
  )
}
