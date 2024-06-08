'use client'

import { AnimatePresence, motion } from 'framer-motion'
import NextImage from 'next/image'
import NextLink from 'next/link'

import LogoSunset from '@/assets/logo-sunset.svg'
import { cn } from '@/lib/utils'

type AppLogoTitleProps = { showText?: boolean } & Partial<React.ComponentProps<typeof NextLink>>

export const AppLogoTitle = ({ showText = true, className, ...props }: AppLogoTitleProps) => {
  return (
    <NextLink href="/" {...props} className={cn('shrink-0', className)}>
      <motion.div className="gap-1 flex-start">
        <NextImage src={LogoSunset} alt="logo" className="size-7 flex-none" priority unoptimized />
        <AnimatePresence>
          {showText && (
            <motion.h1
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hidden flex-none font-semibold tracking-tight sm:inline md:text-xl"
            >
              e/suite
            </motion.h1>
          )}
        </AnimatePresence>
      </motion.div>
    </NextLink>
  )
}
