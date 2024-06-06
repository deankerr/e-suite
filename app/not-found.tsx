import { Link, Quote } from '@radix-ui/themes'
import NextLink from 'next/link'

export const metadata = {
  title: '404',
}

export default function NotFound() {
  return (
    <div className="h-screen gap-8 flex-col-center">
      <Quote className="font-serif text-7xl font-semibold">404</Quote>
      <div className="text-xl font-medium">Page not found.</div>
      <Link asChild>
        <NextLink href="/">Return Home</NextLink>
      </Link>
    </div>
  )
}
