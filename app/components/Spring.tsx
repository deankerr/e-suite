import { Button, Card } from '@radix-ui/themes'
import { animated, useSpring } from '@react-spring/web'

export const Spring1 = () => {
  // const springs = useSpring({
  //   from: { x: 0 },
  //   to: { x: 100 },
  // })

  const [springs, api] = useSpring(() => ({
    from: { x: 0 },
  }))

  const handleClick = () => {
    void api.start({
      from: {
        x: 0,
      },
      to: {
        x: 100,
      },
    })
  }

  return (
    <animated.div
      onClick={handleClick}
      style={{
        width: 80,
        height: 80,
        background: '#ff6d6d',
        borderRadius: 8,
        ...springs,
      }}
    />
  )
}

const ButtCard = (props: any) => {
  return (
    <Card className="h-48 w-40" {...props}>
      <Button>Im a Butt Card!</Button>
    </Card>
  )
}

export const Spring2 = () => {
  const AnimatedButtonCard = animated(ButtCard)

  const styles = useSpring({
    from: {
      y: '0%',
    },
    to: {
      y: '70%',
    },
  })

  const [springs, api] = useSpring(() => ({
    x: 0,
    y: 0,
    backgroundColor: '#ff0000',
    scale: [1, 1, 1],
    config: {
      precision: 0.0001,
    },
  }))

  const handleClick = () => {
    void api.start({
      from: {
        backgroundColor: '#ff0000',
        scale: [1, 1, 1],
      },
      to: {
        backgroundColor: '#000fff',
        scale: [0.2, 0.1, 0.4],
      },
    })
  }

  return <AnimatedButtonCard style={springs} onClick={() => handleClick()} />
}
