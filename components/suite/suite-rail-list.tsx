import { cn } from '@/lib/utils'
import {
  CaretDownIcon,
  CaretRightIcon,
  CircleIcon,
  RocketIcon,
  StarFilledIcon,
} from '@radix-ui/react-icons'
import { Session } from 'next-auth/types'
import Link from 'next/link'
import { SignInOutButton } from '../sign-in-out-button'
import { ThemeToggle } from '../ui/theme-toggle'

export function SuiteRailList({ uid, className }: { uid: string } & React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col justify-between', className)}>
      <div className="grow p-3">
        <h6>
          <CaretDownIcon className="inline" /> Active
        </h6>
        <ul className="mb-4 pl-4">
          <li>
            <StarFilledIcon className="inline" /> Artemis
          </li>
          <li>
            <CircleIcon className="inline" /> Charon
          </li>
          <li>
            <RocketIcon className="inline" /> Dionysus
          </li>
          <li>
            <CircleIcon className="inline" /> Piñata
          </li>
        </ul>
        <h6>
          <CaretRightIcon className="inline" /> Other
        </h6>
      </div>
    </div>
  )
}
