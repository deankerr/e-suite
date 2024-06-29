import type { SVGProps } from 'react'

type SpriteKeys =
  | 'game-icons-laurels-trophy'
  | 'game-icons-skull-crossed-bones'
  | 'game-icons-thumb-down'
  | 'game-icons-thumb-up'

type SpriteIconProps = { icon: SpriteKeys | (string & {}) }

export const SpriteIcon = ({ icon, ...props }: SpriteIconProps & SVGProps<SVGSVGElement>) => {
  return (
    <svg {...props}>
      <use href={`/sprites.svg#${icon}`} />
    </svg>
  )
}

// export const spriteKeys = [
//   'game-icons-all-seeing-eye',
//   'game-icons-artificial-hive',
//   'game-icons-aubergine',
//   'game-icons-bad-gnome',
//   'game-icons-balloon-dog',
//   'game-icons-cook',
//   'game-icons-cyber-eye',
//   'game-icons-delivery-drone',
//   'game-icons-diamond-trophy',
//   'game-icons-dolphin',
//   'game-icons-drinking',
//   'game-icons-dunce-cap',
//   'game-icons-dynamite',
//   'game-icons-eyeball',
//   'game-icons-fallout-shelter',
//   'game-icons-giant-squid',
//   'game-icons-glock',
//   'game-icons-gorilla',
//   'game-icons-ham-shank',
//   'game-icons-hemp',
//   'game-icons-holosphere',
//   'game-icons-italia',
//   'game-icons-laurel-crown',
//   'game-icons-laurels',
//   'game-icons-laurels-trophy',
//   'game-icons-mug-shot',
//   'game-icons-nuclear-waste',
//   'game-icons-perspective-dice-six-faces-five',
//   'game-icons-poison-cloud',
//   'game-icons-radioactive',
//   'game-icons-shrug',
//   'game-icons-skull-crossed-bones',
//   'game-icons-smitten',
//   'game-icons-star-struck',
//   'game-icons-stomach',
//   'game-icons-thumb-down',
//   'game-icons-thumb-up',
//   'game-icons-turd',
//   'game-icons-unlit-bomb',
// ]
