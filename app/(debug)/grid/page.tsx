'use client'

import { Card, Heading } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import NextImage from 'next/image'

import { CanvasRevealEffect } from '@/components/ui/CanvasRevealEffect'
import { StaticImage } from '@/components/ui/StaticImage'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Ent } from '@/convex/types'
import { ClassNameValue, cn } from '@/lib/utils'

export default function Page() {
  return (
    <div className="flex h-full w-full">
      <KnownGrid3 />
    </div>
  )
}

function KnownGrid3() {
  const imgPq = useQuery(api.files.images.getMany, { imageIds: port })
  const imgLq = useQuery(api.files.images.getMany, { imageIds: land })
  const imgSq = useQuery(api.files.images.getMany, { imageIds: sqr })

  return (
    <div className="flex h-full w-full flex-col items-center gap-4 px-4">
      <Card className="mt-4">
        <div className="space-y-4 py-2 sm:px-4">
          <p className="font-merriweather text-center text-3xl">A smashingly good performance.</p>
          <p className="font-merriweather text-center">by lemmer (Realistic Vision 3.0)</p>
        </div>
      </Card>

      <div className="grid-flow-row-dense flex-col content-start items-center gap-4 sm:grid sm:grid-cols-4 md:grid-cols-[repeat(6,_minmax(0,_150px))]">
        <Img3 image={imgSq?.[0]} className="" />
        <Img3 image={imgPq?.[0]} className="" />
        <Img3 image={imgLq?.[0]} className="" />
        <Img3 image={imgSq?.[1]} className="" />
        <Img3 image={imgPq?.[1]} className="" />
      </div>
    </div>
  )
}

function Img3({
  image,
  className,
  ...props
}: {
  className?: ClassNameValue
  image: Ent<'images'> | null | undefined
} & React.ComponentProps<'div'>) {
  if (!image) return null

  const ratio = image.width / image.height
  const gridCn =
    ratio < 1
      ? 'col-span-2 row-span-3'
      : ratio > 1
        ? 'col-span-3 row-span-2'
        : 'col-span-2 row-span-2'

  const aspectCn = ratio < 1 ? 'aspect-[2/3]' : ratio > 1 ? 'aspect-[3/2]' : 'aspect-square'

  if (!image.storageUrl) {
    return (
      <Card className={cn(gridCn, aspectCn, className)}>
        <CanvasRevealEffect
          {...props}
          animationSpeed={3}
          className={cn('', className)}
          colors={[
            [255, 128, 31],
            [254, 137, 198],
          ]}
        />
      </Card>
    )
  }

  return (
    <Card className={cn(gridCn, className)}>
      <NextImage
        key={image._id}
        alt=""
        src={image.storageUrl!}
        width={image.width}
        height={image.height}
        className={cn('rounded object-contain')}
      />
    </Card>
  )
}

function KnownGrid2() {
  const imgPq = useQuery(api.files.images.getMany, { imageIds: port })
  const imgLq = useQuery(api.files.images.getMany, { imageIds: land })
  const imgSq = useQuery(api.files.images.getMany, { imageIds: sqr })

  const imglist = [imgSq?.[0], imgSq?.[1], imgPq?.[0], imgPq?.[1]]

  return (
    <Card className="m-auto">
      <div className="flex h-full flex-col items-center gap-2 overflow-hidden">
        <div className="flex w-full flex-col justify-center gap-2 border-b py-4">
          <Heading size="7" align="center" className="font-code">
            A smashingly good performance.
          </Heading>
          <Heading size="3" className="text-gray-11" align="center">
            The Snard upon Themes
          </Heading>
        </div>

        <div className="flex grow overflow-hidden border-lime-9 p-4">
          <div className="grid gap-2 overflow-hidden sm:grid-cols-[1fr_.73fr_1fr]">
            <div className="aspect-[2/3]">
              <Img image={imglist[2]} className="" />
            </div>

            <div className="flex aspect-[2/3] flex-col items-center justify-between gap-2">
              <Img image={imglist[0]} />
              <Img image={imglist[1]} />
            </div>

            <div className="aspect-[2/3] ">
              <Img image={imglist[3]} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

function Img({
  image,
  className,
  ...props
}: {
  className?: ClassNameValue
  image: Ent<'images'> | null | undefined
} & React.ComponentProps<'div'>) {
  if (!image) return null

  if (!image.storageUrl) {
    return (
      <div
        className="h-auto w-full overflow-hidden"
        style={{
          width: image.width,
          height: image.height,
          maxWidth: '100%',
          maxHeight: image.height > image.width ? '100%' : '50%',
        }}
      >
        <CanvasRevealEffect
          {...props}
          animationSpeed={3}
          className={cn('rounded border border-gray-6 bg-gray-1', className)}
          colors={[
            [255, 128, 31],
            [254, 137, 198],
          ]}
        />
      </div>
    )
  }

  return (
    <NextImage
      key={image._id}
      alt=""
      src={image.storageUrl!}
      width={image.width}
      height={image.height}
      className={cn(
        'rounded border border-gray-6 ',
        image.height > image.width ? '' : 'w-auto grow',
      )}
    />
  )
}

function KnownGrid() {
  const imgPq = useQuery(api.files.images.getMany, { imageIds: port })
  const imgLq = useQuery(api.files.images.getMany, { imageIds: land })
  const imgSq = useQuery(api.files.images.getMany, { imageIds: sqr })

  const imgP = (n: number) => {
    const img = imgPq?.[n]
    if (!img) return null
    return <StaticImage alt="" image={img} className={cn('row-span-2', '')} />
  }

  const imgL = (n: number) => {
    const img = imgLq?.[n]
    if (!img) return null
    return <StaticImage alt="" image={img} className={cn('', '')} />
  }

  const imgS = (n: number) => {
    const img = imgSq?.[n]
    if (!img) return null
    return <StaticImage alt="" image={img} className={cn('', '')} />
  }

  const imglist = [imgSq?.[0], imgSq?.[1], imgPq?.[0], imgPq?.[1]]
  return (
    <Card className="">
      <div className="flex h-full flex-col items-center">
        <div className="flex flex-col justify-center p-8">
          <Heading size="7" align="center">
            A smashingly good performance
          </Heading>
          <Heading size="4" className="text-gray-11" align="center">
            The Snard upon Themes
          </Heading>
        </div>

        {/* <div className="flex grow items-center justify-center gap-4 bg-pink-3"> */}
        <div className="flex grow border-lime-9">
          <div className="m-auto grid w-fit grid-flow-col grid-cols-3 grid-rows-2 place-items-center gap-4">
            {imglist.map((img) =>
              img ? (
                <NextImage
                  key={img._id}
                  alt=""
                  src={img.storageUrl!}
                  width={img.width}
                  height={img.height}
                  className={cn(
                    'rounded border-2 border-accent-8',
                    img.height > img.width ? 'row-span-2' : 'h-full max-h-[378px] w-auto',
                  )}
                />
              ) : null,
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

function Griddle() {
  const imgPq = useQuery(api.files.images.getMany, { imageIds: port })
  const imgLq = useQuery(api.files.images.getMany, { imageIds: land })
  const imgSq = useQuery(api.files.images.getMany, { imageIds: sqr })

  const imgP = (n: number) => {
    const img = imgPq?.[n]
    if (!img) return null
    return <StaticImage alt="" image={img} className={cn('h-full', 'col-span-4 row-span-6')} />
  }

  const imgL = (n: number) => {
    const img = imgLq?.[n]
    if (!img) return null
    return <StaticImage alt="" image={img} className={cn('h-full', 'col-span-6 row-span-4')} />
  }

  const imgS = (n: number) => {
    const img = imgSq?.[n]
    if (!img) return null
    return <StaticImage alt="" image={img} className={cn('h-full', 'col-span-3 row-span-3')} />
  }

  return (
    <Card className="h-full">
      <div className="grid h-full grid-flow-row-dense grid-cols-12 grid-rows-10 content-center gap-4">
        {/* <Boxes n={30} /> */}
        {/* {imgP(0)}
        {imgS(1)}
        {imgL(1)}
        {imgP(0)}
        {imgS(1)}
      {imgS(1)} */}
        {imgP(1)}
        {imgL(1)}
        {imgP(0)}
        {imgS(1)}
        {imgS(2)}
        {/* {imgP(2)} */}

        {/* {imgP(1)} */}

        {/* {imgP(1)} */}
        {/* {imgL(3)} */}
      </div>
    </Card>
  )
}
// grid-cols-[repeat(auto-fill,_minmax(256px,_1fr))]

function One() {
  const imagesPLS = useQuery(api.files.images.getMany, { imageIds: [...port, ...land, ...sqr] })
  const images = useQuery(api.files.images.list, { limit: 16 })

  const imgP = useQuery(api.files.images.getMany, { imageIds: port })
  const imgL = useQuery(api.files.images.getMany, { imageIds: land })
  const imgS = useQuery(api.files.images.getMany, { imageIds: sqr })

  const imgMix = [imgP?.slice(0, 2), imgL?.slice(0, 1), imgS?.slice(0, 1)].flat()

  const imgP0 = imgP?.[0]
  const imgS0 = imgS?.[0]
  const imgS1 = imgS?.[1]
  const imgL0 = imgL?.[0]
  return (
    <div className="h-full w-full bg-blue-2 p-8">
      <Card className="h-full">
        {/* <div className="grid h-full grid-flow-row-dense gap-2">
          {imgMix?.map((image) =>
            image ? (
              <StaticImage
                key={image?._id}
                alt=""
                image={image}
                className={cn('h-full', getSpan(image.width, image.height))}
              />
            ) : null,
          )}
        </div> */}
        <div className="flex h-full w-full gap-2">
          {/* title + p */}
          <div className="bXorder flex h-full flex-col justify-between gap-2 border-iris">
            {/* title */}
            {/* 
            <div className="flex flex-col justify-center p-8">
              <Heading size="7" align="center">
                A smashingly good performance
              </Heading>
              <Heading size="4" className="text-gray-11" align="center">
                The Snard upon Themes
              </Heading>
            </div>
             */}
            <div className="h-1/2">
              {imgP?.[1] ? <StaticImage alt="" image={imgP?.[1]} className={cn('h-full')} /> : null}
            </div>
            {/* portrait */}
            <div className="h-1/2">
              {imgP?.[0] ? <StaticImage alt="" image={imgP?.[0]} className={cn('h-full')} /> : null}
            </div>
          </div>

          {/* 2s + l */}
          <div className="bXorder flex h-full flex-col justify-between gap-2 overflow-hidden border-pink">
            <div className="flex gap-2">
              {imgS0 ? <StaticImage alt="" image={imgS0} className={cn('')} /> : null}
              {imgS1 ? <StaticImage alt="" image={imgS1} className={cn('')} /> : null}
            </div>

            <div className="h-1/2">
              {imgL0 ? <StaticImage alt="" image={imgL0} className={cn('h-full')} /> : null}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function getSpan(w: number, h: number) {
  return w > h ? 'col-span-2' : h > w ? 'row-span-2' : ''
}

function Boxes({ n }: { n: number }) {
  const colors = shuffleRxColors()
  console.log(colors)
  return Array.from({ length: n }).map((_, i) => (
    <div
      key={i}
      className="h-full w-full"
      // style={{ backgroundColor: `var(--${colors[i % colors.length]}-8)` }}
      style={{ backgroundColor: `var(--${rxColors[i % colors.length]}-8)` }}
    >
      box {i} / {i % colors.length}
    </div>
  ))
}

const port = [
  'nn7ebjkmsbvm5h5xh1bvycp3016pqvfn',
  'nn77x27b0snyak1mjgwkej514x6pq3py',
  'nn7a4dzmry8csqefz10ddsw1ts6pq6s3',
  'nn7c8mp36q0b6hq1sre9en6z596ppebr',
] as Id<'images'>[]
const land = [
  'nn7ajjcw21ggg62cq70j1cpbrx6pnyyn',
  'nn799bdewbh2tsgm4y5s0x9tw96pnqsg',
  'nn79972wm0j6jg1apv1rmp6spx6png4q',
  'nn76bhc2rgcq095ce57tnt6mrn6pmsmb',
] as Id<'images'>[]
const sqr = [
  'nn7f494emjrkc6tyt1mfr9f3f16pp3wr',
  'nn7c3k214dv686ahvz5ff36fyd6pqnkp',
  'nn75hsj5mqw78q8bkpa3d419kd6pptmw',
  'nn7564vhfjb21w9mx8t6s7e5fx6ppk5g',
] as Id<'images'>[]

const rxColors = [
  'tomato',
  'red',
  'ruby',
  'crimson',
  'pink',
  'plum',
  'purple',
  'violet',
  'iris',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'jade',
  'green',
  'grass',
  'yellow',
  'amber',
  'orange',
  'brown',
]

function shuffleRxColors() {
  const shuffled = [...rxColors]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]!
    shuffled[i] = shuffled[j]!
    shuffled[j] = temp
  }
  return shuffled
}
