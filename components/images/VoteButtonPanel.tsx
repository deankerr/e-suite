import { Badge, IconButton } from '@radix-ui/themes'
import { useLocalStorage } from '@uidotdev/usehooks'
import { useMutation, useQuery } from 'convex/react'

import { api } from '@/convex/_generated/api'
import { useSingleFlight } from '@/lib/useSingleFlight'
import { cn } from '@/lib/utils'
import { useConfetti } from '../effects/useConfetti'
import { useSound } from '../effects/useSound'
import { SpriteIcon } from '../ui/SpriteIcon'

import type { Id } from '@/convex/_generated/dataModel'
import type { Generation, GenerationVoteNames } from '@/convex/external'

const voteClasses = [
  { name: 'bad', color: 'red', icon: 'game-icons-skull-crossed-bones' },
  { name: 'poor', color: 'amber', icon: 'game-icons-thumb-down' },
  { name: 'good', color: 'grass', icon: 'game-icons-thumb-up' },
  { name: 'best', color: 'cyan', icon: 'game-icons-diamond-trophy' },
] as const

type VoteButtonPanelProps = {
  generationId: Id<'generations'>
  votes?: Generation['votes']
}

const ckey = crypto.randomUUID()

export const VoteButtonPanel = ({ generationId, votes }: VoteButtonPanelProps) => {
  const [constituent] = useLocalStorage('e-constituent', ckey)
  const myVote = useQuery(api.generation.getMyVote, { generationId, constituent })
  const voteMutation = useMutation(api.generation.vote)

  const { playConfetti } = useConfetti()
  const { playSound } = useSound()

  const sendVote = async (vote: GenerationVoteNames) => {
    try {
      if (!myVote || !constituent) return
      await voteMutation({ vote, constituent, generationId })

      if (vote === 'best') {
        playConfetti()
        playSound('yay')
      }

      if (vote !== 'best' && myVote === 'best') {
        playSound('boo')
      }
    } catch (err) {
      console.error(err)
    }
  }
  const tryVote = useSingleFlight(sendVote)
  if (!votes) return null

  return (
    <div
      className={cn(
        'absolute inset-x-0 bottom-0 flex translate-y-full transition-all group-hover:translate-y-0',
      )}
    >
      <div className="mx-auto mt-auto w-fit gap-4 rounded bg-overlay px-2 py-1 opacity-80 transition-all flex-between hover:opacity-100">
        {voteClasses.map(({ name, color, icon }) => {
          const isSelected = myVote === name
          const hasVoted = myVote !== 'none'
          const count = votes[name]

          return (
            <div key={name}>
              <IconButton
                color={color}
                variant={isSelected ? 'solid' : 'surface'}
                size="2"
                className={cn(
                  'relative overflow-hidden p-0.5',
                  hasVoted && !isSelected && 'grayscale',
                )}
                onClick={() => void tryVote(isSelected ? 'none' : name)}
              >
                <SpriteIcon icon={icon} />
              </IconButton>

              <Badge
                color={color}
                variant={isSelected ? 'solid' : 'surface'}
                size="2"
                radius="large"
                className={cn(
                  'invisible absolute -right-1.5 -top-2 px-1 py-0 shadow group-hover:visible',
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
