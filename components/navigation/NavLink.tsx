import Link from 'next/link'
import { twc } from 'react-twc'

export const NavLink = twc(
  Link,
)`flex [&>svg]:shrink-0 gap-2 rounded border border-transparent px-2 py-2 text-sm font-medium opacity-90 hover:bg-grayA-2 aria-[current=page]:bg-grayA-3 aria-[current=page]:opacity-100`
