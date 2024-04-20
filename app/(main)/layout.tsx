'use client'

// import { useSelectedLayoutSegments } from 'next/navigation'

// import { MainHeader } from './MainHeader'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  // const segments = useSelectedLayoutSegments()

  return (
    <div className="min-h-screen">
      {/* <MainHeader segments={segments} /> */}
      {children}
    </div>
  )
}
