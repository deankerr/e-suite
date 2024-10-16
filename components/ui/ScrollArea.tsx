import { ScrollArea as ScrollAreaPrimitive } from '@radix-ui/themes'

import { twx } from '@/app/lib/utils'

export const ScrollArea = twx(ScrollAreaPrimitive).attrs({
  scrollbars: 'vertical',
})`grow [&>div>div]:max-w-full`
