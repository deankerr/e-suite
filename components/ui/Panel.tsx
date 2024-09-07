import Link from 'next/link'

import { twx } from '@/lib/utils'

export const Panel = twx.div`flex h-full w-full flex-col text-sm overflow-hidden bg-gray-1 md:rounded-md md:border`
export const PanelHeader = twx.div`flex-start h-10 shrink-0 overflow-hidden border-b px-1 font-medium`
export const PanelTitle = twx(Link)`font-medium underline-offset-4 hover:underline`
export const PanelToolbar = twx.div`flex-start h-10 border-b overflow-hidden w-full gap-1 px-1`

export const NavPanel = twx(Panel)`sm:w-72 shrink-0 `
