import { Link } from '@radix-ui/themes'
import NextLink from 'next/link'

export const metadata = {
  title: '404',
}

export default function NotFound() {
  return (
    <div className="h-screen flex-col-center">
      <h1 className="wt-title-1 mb-1">404</h1>
      <div className="">This page could not be found.</div>
      <Link asChild>
        <NextLink href="/">Return Home</NextLink>
      </Link>
    </div>
  )
}
