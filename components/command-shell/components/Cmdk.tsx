'use client'

import * as React from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr'
import { Command as CommandPrimitive } from 'cmdk'

import { cn } from '@/lib/utils'

const Cmdk = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn('flex h-full w-full flex-col overflow-hidden bg-gray-2', className)}
    {...props}
  />
))
Cmdk.displayName = CommandPrimitive.displayName

const CmdkInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className={cn('flex shrink-0 items-center px-3', className)} cmdk-input-wrapper="">
    <MagnifyingGlass className="mr-2 size-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'flex h-11 w-full border-none bg-transparent py-3 text-sm outline-none placeholder:text-gray-10 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  </div>
))

CmdkInput.displayName = CommandPrimitive.Input.displayName

const CmdkList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
    {...props}
  />
))

CmdkList.displayName = CommandPrimitive.List.displayName

const CmdkEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty ref={ref} className="py-6 text-center text-sm" {...props} />
))

CmdkEmpty.displayName = CommandPrimitive.Empty.displayName

const CmdkGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'select-none overflow-hidden p-1 [&_[cmdk-group-heading]]:px-1 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-11 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2',
      className,
    )}
    {...props}
  />
))

CmdkGroup.displayName = CommandPrimitive.Group.displayName

const CmdkSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 h-px bg-gray-6', className)}
    {...props}
  />
))
CmdkSeparator.displayName = CommandPrimitive.Separator.displayName

const CmdkItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center gap-4 rounded px-4 py-2.5 text-sm opacity-90 outline-none aria-selected:bg-grayA-3 aria-selected:text-white aria-selected:opacity-100 data-[disabled="false"]:pointer-events-auto data-[disabled="true"]:opacity-50 [&_svg]:size-4',
      className,
    )}
    {...props}
  />
))

CmdkItem.displayName = CommandPrimitive.Item.displayName

const CmdkShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={cn('ml-auto text-xs tracking-widest text-gray-11', className)} {...props} />
  )
}
CmdkShortcut.displayName = 'CmdkShortcut'

const CmdkLoading = CommandPrimitive.Loading

export {
  Cmdk,
  CmdkInput,
  CmdkList,
  CmdkEmpty,
  CmdkGroup,
  CmdkItem,
  CmdkShortcut,
  CmdkSeparator,
  CmdkLoading,
}
