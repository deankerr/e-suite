'use client'

import { useEffect, useState } from 'react'

export const ImageObjectBoxes = ({ imageUrl }: { imageUrl: string }) => {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (canvasRef && imageUrl) {
      const image = new Image()
      image.src = imageUrl
      image.onload = () => {
        const ctx = canvasRef.getContext('2d')
        if (ctx) {
          canvasRef.width = image.width
          canvasRef.height = image.height
          ctx.drawImage(image, 0, 0)

          objects.forEach((obj) => {
            ctx.strokeStyle = 'red'
            ctx.lineWidth = 2
            ctx.strokeRect(
              obj.box.xmin,
              obj.box.ymin,
              obj.box.xmax - obj.box.xmin,
              obj.box.ymax - obj.box.ymin,
            )

            ctx.fillStyle = 'red'
            ctx.font = '16px Arial'
            ctx.fillText(`${obj.label} (${obj.score.toFixed(2)})`, obj.box.xmin, obj.box.ymin - 5)
          })
        }
      }
    }
  }, [canvasRef, imageUrl])

  return (
    <canvas
      ref={setCanvasRef}
      className="h-auto w-full"
      aria-label="Image with object detection boxes"
      tabIndex={0}
    />
  )
}

// sample data
export const objects = [
  {
    box: {
      xmax: 729,
      xmin: 194,
      ymax: 1200,
      ymin: 11,
    },
    label: 'person',
    score: 0.9994250535964966,
  },
  {
    box: {
      xmax: 381,
      xmin: 268,
      ymax: 1018,
      ymin: 414,
    },
    label: 'tie',
    score: 0.9900033473968506,
  },
  {
    box: {
      xmax: 219,
      xmin: 1,
      ymax: 1034,
      ymin: 921,
    },
    label: 'bench',
    score: 0.9229416847229004,
  },
  {
    box: {
      xmax: 225,
      xmin: 0,
      ymax: 1169,
      ymin: 923,
    },
    label: 'bench',
    score: 0.8594083786010742,
  },
]
