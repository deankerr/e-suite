import { useSpring, useSprings } from '@react-spring/web'
import { useGesture } from '@use-gesture/react'
import { useCallback, useLayoutEffect, useRef } from 'react'

type MenuProps = {
  props?: any
}

const BUTTON_SIZE = 56

const COLORS = ['#669EF2', '#F9DB6D', '#DC602E', '#83BB70']

export const Menu = ({ props }: MenuProps) => {
  const buttonRef = useRef<HTMLDivElement>(null!)
  const avatarRefs = useRef<HTMLDivElement[]>([])
  const avatarRefInitialPositions = useRef<number[]>([])
  const containerRef = useRef<HTMLDivElement>(null!)

  const isVisible = useRef(false)

  const [{ x, y, opacity }, api] = useSpring(
    () => ({
      x: 0,
      y: 0,
      opacity: 0,
    }),
    [],
  )

  const [avatarSprings, avatarApi] = useSprings(
    COLORS.length,
    (i) => ({
      y: 0,
    }),
    [],
  )

  useLayoutEffect(() => {
    if (avatarRefInitialPositions.current.length === 0) {
      const { y: buttonY } = buttonRef.current.getBoundingClientRect()

      avatarRefInitialPositions.current = avatarRefs.current.map(
        (node) => buttonY - node.getBoundingClientRect().y,
      )
    }

    void avatarApi.start((i) => ({
      y: avatarRefInitialPositions.current[i],
      immediate: true,
    }))
  }, [])

  const getBounds = useCallback(() => {
    const { height, width } = containerRef.current.getBoundingClientRect()

    return {
      top: 0,
      left: 0,
      right: window.innerWidth - width,
      bottom: window.innerHeight - height,
    }
  }, [])

  const backgroundTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const avatarTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const bindGestures = useGesture(
    {
      onDrag: ({ down, offset: [ox, oy], velocity: [vx, vy], direction: [dx, dy] }) => {
        void api.start({
          x: ox,
          y: oy,
          immediate: down,
          onChange: ({ value }) => {
            const bounds = getBounds()
            if (
              !(
                value.x >= bounds.left &&
                value.x <= bounds.right &&
                value.y >= bounds.top &&
                value.y <= bounds.bottom
              )
            ) {
              api.set({
                x:
                  value.x < bounds.left
                    ? bounds.left
                    : value.x > bounds.right
                      ? bounds.right
                      : value.x,
                y:
                  value.y < bounds.top
                    ? bounds.top
                    : value.y > bounds.bottom
                      ? bounds.bottom
                      : value.y,
              })
            }
          },
          config: (key) => {
            return {
              velocity: key === 'x' ? vx * dx : vy * dy,
              decay: true,
            }
          },
        })
      },
      onHover: ({ hovering }) => {
        if (hovering) {
          if (backgroundTimeoutRef.current) {
            clearTimeout(backgroundTimeoutRef.current)
          }
          if (avatarTimeoutRef.current) {
            clearTimeout(avatarTimeoutRef.current)
          }

          isVisible.current = true

          void api.start({
            opacity: 1,
          })

          void avatarApi.start({
            y: 0,
          })
        } else {
          backgroundTimeoutRef.current = setTimeout(() => {
            void api.start({
              opacity: 0,
            })
          }, 1000)

          avatarTimeoutRef.current = setTimeout(() => {
            void avatarApi.start((i) => ({
              y: avatarRefInitialPositions.current[i],
              onRest: () => {
                isVisible.current = false
              },
            }))
          }, 2000)
        }
      },
    },
    {
      drag: {
        from: () => [x.get(), y.get()],
        bounds: getBounds,
        rubberband: true,
      },
    },
  )

  const { onPointerEnter, onPointerLeave, onPointerDown, ...restGestures } = bindGestures()

  const handlePointerDown = (isBackground: boolean) => (e: React.PointerEvent<HTMLElement>) => {
    if (isBackground && !isVisible.current) {
      return
    }

    if (onPointerDown) {
      onPointerDown(e)
    }
  }

  return <div className="">Menu</div>
}
