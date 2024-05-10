import { Button } from '@radix-ui/themes'
import { useConvex } from 'convex/react'

export const Monitor = () => {
  const convex = useConvex()
  // const { loadMore } = useGlobalThreadManager()

  return (
    <>
      <Button
        variant="surface"
        color="mint"
        onClick={() => {
          console.log(convex)
        }}
      >
        M
      </Button>
      <Button
        variant="surface"
        color="pink"
        onClick={() => {
          // loadMore(5)
        }}
      >
        M
      </Button>
      <div className="font-mono text-xs"></div>
    </>
  )
}
