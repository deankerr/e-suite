'use client'

import { AnimatePresence, motion } from 'framer-motion'
import NextImage from 'next/image'
import Link from 'next/link'

import LogoSunset from '@/assets/logo-sunset.svg'
import { cn } from '@/lib/utils'

type AppLogoTitleProps = { showText?: boolean } & Partial<React.ComponentProps<typeof Link>>

export const AppLogoTitle = ({ showText = true, className, ...props }: AppLogoTitleProps) => {
  return (
    <Link href="/" {...props} className={cn('flex-none', className)}>
      <motion.div className="gap-1 flex-start">
        <NextImage
          src={LogoSunset}
          alt="logo"
          className="size-5 flex-none md:size-6"
          priority
          unoptimized
        />
        <AnimatePresence>
          {showText && (
            <motion.h1
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-none font-semibold tracking-tight md:text-lg"
            >
              e/suite
            </motion.h1>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  )
}
