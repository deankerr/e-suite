import Link from 'next/link'

export function NavLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar w-full rounded-b-md bg-primary text-primary-content">
          <div className="flex-none sm:hidden">
            {/* Menu Button */}
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <SVGHamburger />
            </label>
          </div>
          <Link href="/" className="btn btn-ghost text-xl normal-case">
            pabel
          </Link>
          <div className="hidden flex-none sm:block">
            <menu className="flex">
              {/* Navbar menu content here */}
              <li>
                <Link href="/chat" className="text-md btn btn-ghost font-normal normal-case">
                  chat
                </Link>
              </li>
              <li>
                <Link href="/" className="text-md btn btn-ghost font-normal normal-case">
                  image
                </Link>
              </li>
            </menu>
          </div>
        </div>
        {/* Page content here */}
        {children}
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu min-h-full w-80 bg-base-200 p-4">
          {/* Sidebar content here */}
          <li>
            <a>Sidebar Item 1</a>
          </li>
          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul>
      </div>
    </div>
  )
}

const SVGHamburger = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    className="inline-block h-6 w-6 stroke-current"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6h16M4 12h16M4 18h16"
    ></path>
  </svg>
)
