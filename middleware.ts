import { authMiddleware } from '@clerk/nextjs/server'

export default authMiddleware({
  publicRoutes: ['/', '/chat/:slug', '/generate/:slug', '/m', '/m/:slug', '/t', '/t/:slug'],
  ignoredRoutes: ['/icon'],
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
