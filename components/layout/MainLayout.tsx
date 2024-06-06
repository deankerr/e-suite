import { NavRail } from '@/components/layout/NavRail'

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="fixed flex h-full w-full bg-gray-1">
      <div className="absolute inset-0 bg-orange-3 bg-[size:20px_20px] opacity-20 blur-[100px]"></div>
      <div className='absolute inset-0 bg-[url("/nn2.svg")]' />

      <NavRail className="hidden h-full sm:flex" />
      {children}
    </div>
  )
}
