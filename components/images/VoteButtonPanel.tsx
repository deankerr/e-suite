import { Badge, IconButton } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { z } from 'zod'

import { api } from '@/convex/_generated/api'
import { useLocalOwnVotesCache } from '@/lib/hooks'
import { useSingleFlight } from '@/lib/useSingleFlight'
import { cn } from '@/lib/utils'
import { SpriteIcon } from '../ui/SpriteIcon'

import type { Id } from '@/convex/_generated/dataModel'
import type { GenerationVoteNames } from '@/convex/external'
import type { FunctionReturnType } from 'convex/server'

const voteClasses = [
  { name: 'bad', color: 'red', icon: 'game-icons-skull-crossed-bones' },
  { name: 'poor', color: 'amber', icon: 'game-icons-thumb-down' },
  { name: 'good', color: 'grass', icon: 'game-icons-thumb-up' },
  { name: 'best', color: 'cyan', icon: 'game-icons-diamond-trophy' },
] as const

type VoteButtonPanelProps = {
  generationId: Id<'generations'>
  votes?: FunctionReturnType<typeof api.generation.getVotes>
}

const registerResponseSchema = z.object({ constituent: z.string() })

export const VoteButtonPanel = ({ generationId, votes }: VoteButtonPanelProps) => {
  const [voteCache, setVoteCache] = useLocalOwnVotesCache()
  const voteMutation = useMutation(api.generation.vote)

  const sendVote = async (vote: GenerationVoteNames) => {
    try {
      if (!votes) return

      if (!voteCache.constituent) {
        const body = JSON.stringify({ vote, generationId })
        console.log('START', body)

        const response = await fetch('/api/register-to-vote', {
          method: 'POST',
          body,
        })

        const { constituent } = registerResponseSchema.parse(await response.json())
        setVoteCache(({ votes }) => ({ constituent, votes: { ...votes, [generationId]: vote } }))
        console.log('got constituent', constituent)
        return
      }

      const { constituent } = voteCache
      await voteMutation({ constituent, vote, generationId })
      setVoteCache(({ votes }) => ({ constituent, votes: { ...votes, [generationId]: vote } }))

      console.log('END')
    } catch (err) {
      console.error(err)
    }
  }
  const tryVote = useSingleFlight(sendVote)
  if (!votes) return null

  return (
    <div
      className={cn(
        'absolute inset-x-0 bottom-0 translate-y-full transition-all group-hover:translate-y-0',
      )}
    >
      <div className="mx-auto w-fit translate-y-0 scale-100 gap-1 rounded bg-overlay px-1 py-1 opacity-50 transition-all flex-between hover:-translate-y-1.5 hover:scale-150 hover:opacity-100">
        {voteClasses.map(({ name, color, icon }) => {
          const isSelected = voteCache.votes[generationId] === name
          const hasVoted = !!voteCache.votes[generationId]
          const count = votes[name]

          return (
            <div key={name}>
              <IconButton
                color={color}
                variant={isSelected ? 'solid' : 'surface'}
                size="1"
                className={cn(
                  'relative overflow-hidden p-0.5 opacity-80 hover:opacity-90',
                  hasVoted && !isSelected && 'grayscale-[.8]',
                )}
                onClick={() => void tryVote(name)}
              >
                <SpriteIcon icon={icon} />
              </IconButton>
              <Badge
                color={color}
                variant={isSelected ? 'solid' : 'surface'}
                size="1"
                radius="large"
                className={cn(
                  'absolute -right-1.5 -top-2 scale-75 px-1 py-0 shadow',
                  !count && 'hidden',
                )}
              >
                {count}
              </Badge>
            </div>
          )
        })}
      </div>
    </div>
  )
}
