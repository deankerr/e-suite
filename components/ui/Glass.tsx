import { motion } from 'framer-motion'

type RefractionProps = {
  saturate: number
  brightness: number
  blur: number
  width: number
  total: number
  position: number
  backgroundColor?: string
  type: 'linear' | 'radial'
  borderRadius?: number
  borderTopLeftRadius?: number
  borderTopRightRadius?: number
  borderBottomLeftRadius?: number
  borderBottomRightRadius?: number
}

const Refraction = ({
  saturate = 100,
  brightness = 100,
  blur = 1,
  width,
  total,
  position,
  backgroundColor,
  type,
  borderRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomLeftRadius,
  borderBottomRightRadius,
}: RefractionProps) => {
  const backdropFilter = `saturate(${saturate}%) brightness(${brightness}%) blur(${blur}px)`
  const startOffset = position * width
  const endOffset = startOffset + width

  let maskImage =
    type === 'linear' ? `repeating-linear-gradient(90deg, ` : `repeating-radial-gradient(`
  maskImage += `
    transparent 0px,
    transparent ${startOffset}px,
    black ${startOffset}px,
    black ${endOffset}px,
    transparent ${endOffset}px,
    transparent ${total * width}px
  )`

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        backdropFilter,
        WebkitBackdropFilter: backdropFilter,
        maskImage,
        WebkitMaskImage: maskImage,
        backgroundColor,

        borderTopLeftRadius: borderTopLeftRadius ?? borderRadius,
        borderTopRightRadius: borderTopRightRadius ?? borderRadius,
        borderBottomLeftRadius: borderBottomLeftRadius ?? borderRadius,
        borderBottomRightRadius: borderBottomRightRadius ?? borderRadius,
      }}
    />
  )
}

type GlassProps = {
  type?: 'linear' | 'radial'
  barWidth?: number
  borderRadius?: number
  borderTopLeftRadius?: number
  borderTopRightRadius?: number
  borderBottomLeftRadius?: number
  borderBottomRightRadius?: number
} & React.ComponentProps<typeof motion.div>

export const Glass = ({
  type = 'linear',
  barWidth = 1.5,
  borderRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomLeftRadius,
  borderBottomRightRadius,
  ...props
}: GlassProps) => {
  return (
    <motion.div {...props}>
      <Refraction
        blur={4}
        saturate={150}
        brightness={120}
        type={type}
        width={barWidth}
        total={3}
        position={0}
        borderRadius={borderRadius}
        borderTopLeftRadius={borderTopLeftRadius}
        borderTopRightRadius={borderTopRightRadius}
        borderBottomLeftRadius={borderBottomLeftRadius}
        borderBottomRightRadius={borderBottomRightRadius}
      />
      <Refraction
        blur={2}
        saturate={110}
        brightness={130}
        type={type}
        width={barWidth}
        total={3}
        position={1}
        borderRadius={borderRadius}
        borderTopLeftRadius={borderTopLeftRadius}
        borderTopRightRadius={borderTopRightRadius}
        borderBottomLeftRadius={borderBottomLeftRadius}
        borderBottomRightRadius={borderBottomRightRadius}
      />
      <Refraction
        blur={1}
        saturate={150}
        brightness={110}
        type={type}
        width={barWidth}
        total={3}
        position={2}
        borderRadius={borderRadius}
        borderTopLeftRadius={borderTopLeftRadius}
        borderTopRightRadius={borderTopRightRadius}
        borderBottomLeftRadius={borderBottomLeftRadius}
        borderBottomRightRadius={borderBottomRightRadius}
        backgroundColor="rgba(255, 255, 255, 0.1)"
      />
    </motion.div>
  )
}
