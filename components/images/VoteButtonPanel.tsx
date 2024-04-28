import { IconButton } from '@radix-ui/themes'
import { useLocalStorage } from '@uidotdev/usehooks'

import { api } from '@/convex/_generated/api'
import { useSingleFlight } from '@/lib/useSingleFlight'
import { cn } from '@/lib/utils'
import { SpriteIcon } from '../ui/SpriteIcon'

import type { Id } from '@/convex/_generated/dataModel'
import type { GenerationVoteNames } from '@/convex/external'
import type { FunctionReturnType } from 'convex/server'

type VoteButtonPanelProps = {
  generationId: Id<'generations'>
  votes?: FunctionReturnType<typeof api.generation.getVotes>
}

export const VoteButtonPanel = ({ generationId, votes }: VoteButtonPanelProps) => {
  const [ownVoteCache, setOwnVoteCache] = useLocalStorage<
    Record<Id<'generations'>, GenerationVoteNames>
  >('votes', {})

  const sendVote = async (vote: GenerationVoteNames) => {
    try {
      if (!votes) return
      setOwnVoteCache({ ...ownVoteCache, [generationId]: vote })

      const body = JSON.stringify({ vote, generationId })
      console.log('START', body)

      await fetch('/api/vote', {
        method: 'POST',
        body,
      })
      console.log('END')
    } catch (err) {
      console.error(err)
    }
  }

  const tryVote = useSingleFlight(sendVote)

  const currentVote = ownVoteCache[generationId]

  return (
    <div className="mx-auto w-fit scale-75 gap-5 rounded-lg bg-overlay px-3 py-2 transition-all flex-between hover:scale-100">
      <VoteButton
        color="red"
        active={currentVote === 'bad'}
        count={votes?.bad}
        onClick={() => void tryVote('bad')}
      >
        <SpriteIcon icon="game-icons-skull-crossed-bones" />
      </VoteButton>

      <VoteButton
        color="amber"
        active={currentVote === 'poor'}
        count={votes?.poor}
        onClick={() => void tryVote('poor')}
      >
        <SpriteIcon icon="game-icons-thumb-down" className="text-white" />
      </VoteButton>

      <VoteButton
        color="grass"
        active={currentVote === 'good'}
        count={votes?.good}
        onClick={() => void tryVote('good')}
      >
        <SpriteIcon icon="game-icons-thumb-up" />
      </VoteButton>

      <VoteButton
        color="cyan"
        active={currentVote === 'best'}
        count={votes?.best}
        onClick={() => void tryVote('best')}
      >
        <SpriteIcon icon="game-icons-laurels-trophy" />
      </VoteButton>
    </div>
  )
}

type VoteButtonProps = { active?: boolean; count?: number } & Partial<
  React.ComponentProps<typeof IconButton>
>

export const VoteButton = ({ active, count, children, className, ...props }: VoteButtonProps) => {
  return (
    <IconButton
      {...props}
      variant="surface"
      size="3"
      className={cn(
        'relative scale-100 brightness-75 hover:scale-110 hover:brightness-90',
        active && 'scale-125 animate-jump brightness-100',
        className,
      )}
    >
      {children}
      <div
        className={cn(
          'absolute -right-2 -top-2.5 rounded-full bg-orange-9 px-1.5 text-sm font-bold text-gray-12',
          !count && 'hidden',
        )}
      >
        {count}
      </div>
    </IconButton>
  )
}
