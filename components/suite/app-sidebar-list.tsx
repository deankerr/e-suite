import { cn } from '@/lib/utils'
import {
  CaretDownIcon,
  CaretRightIcon,
  CircleIcon,
  RocketIcon,
  StarFilledIcon,
} from '@radix-ui/react-icons'

export function AppSidebarList({ className }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('grid grid-rows-[4rem_7rem_auto] border-2 border-r', className)}>
      <div></div>
      <div className="border-y"></div>
      <div className="p-3">
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
