import { Nav } from '@/app/components/Nav'

export default function NavPage() {
  // NavPage

  return (
    <div className="h-[100vh] w-[86vw] space-y-4 place-self-center border border-accent-2">
      <Nav />
      <Nav tt={true} className="" />
    </div>
  )
}
