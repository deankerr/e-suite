import { NavRail } from '@/components/layout/NavRail'

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="fixed flex h-full w-full flex-col sm:flex-row">
        {/* background layer */}
        <div className="pointer-events-none fixed inset-0 bg-orange-1">
          {/* <Image
            src={GradientBg2}
            alt=""
            className="fixed h-full w-full object-cover opacity-80 brightness-[.65]"
          /> */}
          <div className="fixed inset-0 bg-gradient-to-br from-orange-3 via-orange-1 to-violetA-1"></div>
          {/* <div className="fixed inset-0 bg-orange-8 opacity-20 blur-[100px]"></div> */}
          <div className='fixed inset-0 bg-[url("/nn2.svg")]' />
        </div>

        <NavRail />
        {children}
      </div>
    </>
  )
}
